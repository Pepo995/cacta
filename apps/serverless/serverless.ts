import functions from "@functions";
import resources from "@resources";
import type { AWS } from "@serverless/typescript";

const resolveSSM = process.env.IS_OFFLINE === "true" ? {} : undefined;

const serverlessConfiguration: AWS = {
  service: "serverless",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline", "serverless-prune-plugin"],
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    prune: {
      automatic: true,
      number: 3,
    },
    local: {
      secrets: {
        databaseUrl: "${env:DATABASE_URL, ''}",
        engineSecretKey: "${env:ENGINE_SECRET_KEY, ''}",
      },
    },
    dev: resolveSSM ?? {
      secrets: "${ssm(us-east-2):/aws/reference/secretsmanager/cacta-dev-secrets, ''}",
    },
    demo: resolveSSM ?? {
      secrets: "${ssm(us-east-2):/aws/reference/secretsmanager/cacta-demo-secrets, ''}",
    },
    production: resolveSSM ?? {
      secrets: "${ssm(us-east-2):/aws/reference/secretsmanager/cacta-production-secrets, ''}",
    },
  },
  provider: {
    name: "aws",
    profile: "cacta",
    runtime: "nodejs18.x",
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        "Fn::GetAtt": ["IAMRole", "Arn"],
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      DATABASE_URL: "${self:custom.${self:provider.stage}.secrets.databaseUrl, ''}",
      ENGINE_SECRET_KEY: "${self:custom.${self:provider.stage}.secrets.engineSecretKey, ''}",
    },
  },
  functions,
  resources,
  package: {
    individually: true,
    patterns: ["src/functions/worker/libquery_engine-*", "src/functions/worker/schema.prisma"],
  },
};

module.exports = serverlessConfiguration;
