# Hosted Zone para o domínio aizen.dev.br

resource "aws_route53_record" "financy" {
  zone_id = "Z02325572KOQXNUOJHFHK"
  name    = "financy.aizen.dev.br"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

