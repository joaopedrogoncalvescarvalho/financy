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
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
            "token.actions.githubusercontent.com:sub" = "repo:joaopedrogoncalvescarvalho@50954677/financy@1382482821:ref:refs/heads/main"
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

# IAM Policy for GitHub Actions
resource "aws_iam_role_policy" "github_actions" {
  name = "financy-github-actions-policy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "TerraformStateList"
        Effect = "Allow"

        Action = [
          "s3:ListBucket"
        ]

        Resource = "arn:aws:s3:::infra-configure"

        Condition = {
          StringLike = {
            "s3:prefix" = [
              "financy/production/*"
            ]
          }
        }
      },

      {
        Sid    = "TerraformStateObjects"
        Effect = "Allow"

        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]

        Resource = "arn:aws:s3:::infra-configure/financy/production/*"
      },

      {
        Sid    = "FrontendBucket"
        Effect = "Allow"

        Action = [
          "s3:ListBucket",
          "s3:GetBucketAcl",
          "s3:GetBucketPolicy",
          "s3:GetBucketLocation",
          "s3:GetBucketVersioning",
          "s3:GetBucketWebsite",
          "s3:GetBucketCors",
          "s3:GetBucketLogging",
          "s3:GetBucketTagging",
          "s3:GetEncryptionConfiguration",
          "s3:GetLifecycleConfiguration",
          "s3:GetReplicationConfiguration",
          "s3:GetBucketPublicAccessBlock",
          "s3:GetBucketOwnershipControls",
          "s3:GetBucketNotification"
        ]

        Resource = aws_s3_bucket.frontend_static.arn
      },

      {
        Sid    = "FrontendBucketObjects"
        Effect = "Allow"

        Action = [
          "s3:GetObject",
          "s3:GetObjectAcl",
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:DeleteObject",
          "s3:ListBucketMultipartUploads",
          "s3:ListMultipartUploadParts",
          "s3:AbortMultipartUpload"
        ]

        Resource = "${aws_s3_bucket.frontend_static.arn}/*"
      },

      {
        Sid    = "GithubActionsRole"
        Effect = "Allow"

        Action = [
          "iam:GetRole",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:UpdateRole",
          "iam:UpdateAssumeRolePolicy",
          "iam:GetRolePolicy",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:ListInstanceProfilesForRole",
          "iam:TagRole",
          "iam:UntagRole"
        ]

        Resource = aws_iam_role.github_actions.arn
      },

      {
        Sid    = "GithubOidcProvider"
        Effect = "Allow"

        Action = [
          "iam:GetOpenIDConnectProvider",
          "iam:CreateOpenIDConnectProvider",
          "iam:UpdateOpenIDConnectProvider",
          "iam:DeleteOpenIDConnectProvider",
          "iam:TagOpenIDConnectProvider",
          "iam:UntagOpenIDConnectProvider"
        ]

        Resource = aws_iam_openid_connect_provider.github_actions.arn
      }
    ]
  })
}