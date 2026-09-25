terraform {
  required_version = ">= 1.5.0"

  backend "s3" {
    bucket  = "infra-configure"
    key     = "financy/production/terraform-backend.tfstate"
    region  = "us-east-2"
    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
