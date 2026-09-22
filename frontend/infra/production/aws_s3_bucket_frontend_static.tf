provider "aws" {
  region = "us-east-2"
}

resource "aws_s3_bucket" "frontend_static" {
  bucket = "financy-static-website-production"

  tags = {
    Project     = "financy"
    Environment = "production"
    Resource    = "frontend-static"
    ManagedBy   = "terraform"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_static" {
  bucket = aws_s3_bucket.frontend_static.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "aws_s3_bucket_frontend_static_bucket_name" {
  description = "Nome do bucket criado"
  value       = aws_s3_bucket.frontend_static.bucket
}

output "aws_s3_bucket_frontend_static_bucket_arn" {
  description = "ARN do bucket criado"
  value       = aws_s3_bucket.frontend_static.arn
}
