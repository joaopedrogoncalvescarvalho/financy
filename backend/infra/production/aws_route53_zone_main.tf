resource "aws_route53_record" "api" {
  zone_id = "Z02325572KOQXNUOJHFHK"
  name    = "api.financy.aizen.dev.br"
  type    = "A"
  ttl     = 300
  records = ["2.24.117.188"]
}
