provider "aws" {
  region = "us-east-2"
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
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

resource "aws_s3_bucket_website_configuration" "frontend_static" {
  bucket = aws_s3_bucket.frontend_static.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_static" {
  bucket = aws_s3_bucket.frontend_static.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "frontend_static" {
  bucket = aws_s3_bucket.frontend_static.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipalReadOnly"
        Effect = "Allow"

        Principal = {
          Service = "cloudfront.amazonaws.com"
        }

        Action = [
          "s3:GetObject"
        ]

        Resource = "${aws_s3_bucket.frontend_static.arn}/*"

        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.s3_distribution.arn
          }
        }
      }
    ]
  })
}

output "aws_s3_bucket_frontend_static_bucket_name" {
  description = "Nome do bucket criado"
  value       = aws_s3_bucket.frontend_static.bucket
}

output "aws_s3_bucket_frontend_static_bucket_arn" {
  description = "ARN do bucket criado"
  value       = aws_s3_bucket.frontend_static.arn
}
