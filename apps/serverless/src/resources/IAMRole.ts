const IAMRole = {
  Type: "AWS::IAM::Role",
  Properties: {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Effect: "Allow",
          Action: "sts:AssumeRole",
          Principal: {
            Service: "lambda.amazonaws.com",
          },
        },
      ],
      Version: "2012-10-17",
    },
    Policies: [
      {
        PolicyName: "CanLog",
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: [
                "logs:CreateLogStream",
                "logs:CreateLogGroup",
                "logs:PutLogEvents",
              ],
              Resource: "arn:aws:logs:*:*:*",
            },
          ],
        },
      },
      {
        PolicyName: "CanSecretsManager",
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["secretsmanager:GetSecretValue"],
              Resource: "arn:aws:secretsmanager:*:*:secret:cacta-*",
            },
          ],
        },
      },
    ],
  },
};

export default IAMRole;
