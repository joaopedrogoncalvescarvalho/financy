# OIDC Provider for GitHub Actions
resource "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1"
  ]

  tags = {
    Project     = "financy"
    Environment = "production"
    Resource    = "github-actions-oidc"
    ManagedBy   = "terraform"
  }
}

# IAM Role for GitHub Actions
resource "aws_iam_role" "github_actions" {
  name = "financy-github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github_actions.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              "repo:joaopedrogoncalvescarvalho/financy:ref:refs/heads/main",
              "repo:joaopedrogoncalvescarvalho/financy:ref:refs/heads/production",
              "repo:joaopedrogoncalvescarvalho/financy:ref:refs/tags/*"
            ]
          }
        }
      }
    ]
  })

  tags = {
    Project     = "financy"
    Environment = "all"
    Resource    = "github-actions-role"
    ManagedBy   = "terraform"
  }
}

# IAM Policy for S3 deployment
resource "aws_iam_role_policy" "s3_deploy" {
  name = "financy-s3-deploy-policy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.frontend_static.arn,
          "${aws_s3_bucket.frontend_static.arn}/*"
        ]
      }
    ]
  })
}
