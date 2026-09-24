# Certificado ACM para domínios customizados (em us-east-1 para CloudFront)
resource "aws_acm_certificate" "financy" {
  provider = aws.us_east_1

  domain_name       = "financy.aizen.dev.br"
  validation_method = "DNS"

  tags = {
    Resource = "acm-certificate"
    Domain   = "financy.aizen.dev.br"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Validação do certificado via Route53
resource "aws_acm_certificate_validation" "website" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.financy.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]

  timeouts {
    create = "5m"
  }
}

# Records de validação automática
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.financy.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = "Z02325572KOQXNUOJHFHK"
}