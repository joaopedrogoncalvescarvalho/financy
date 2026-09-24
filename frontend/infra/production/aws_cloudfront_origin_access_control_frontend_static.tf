# Origin Access Control para o CloudFront acessar o S3 de forma segura
resource "aws_cloudfront_origin_access_control" "frontend_static" {
  name                              = "financy-s3-frontend_static"
  description                       = "Origin Access Control for S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.frontend_static.bucket_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend_static.id
    origin_id                = "S3-${aws_s3_bucket.frontend_static.bucket}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  # Domínios customizados
  aliases = [
    "financy.aizen.dev.br"
  ]

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.frontend_static.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  # Configuração de erro para SPAs
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    # Certificado ACM para domínios customizados
    acm_certificate_arn      = aws_acm_certificate_validation.website.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Resource = "cloudfront-distribution"
    Env      = "production"
  }
}

output "cloudfront_domain_name" {
  description = "Domain name da distribuição CloudFront"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "cloudfront_distribution_id" {
  description = "ID da distribuição CloudFront"
  value       = aws_cloudfront_distribution.s3_distribution.id
}

output "website_cloudfront_url" {
  description = "URL do site via CloudFront"
  value       = "https://${aws_cloudfront_distribution.s3_distribution.domain_name}"
}

output "all_domain_urls" {
  description = "Todas as URLs disponíveis para acesso ao site"
  value = concat(
    ["https://${aws_cloudfront_distribution.s3_distribution.domain_name}"],
    [
      "https://${aws_route53_record.financy.name}"
    ]
  )
}