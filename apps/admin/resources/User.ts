import { getModelByName } from "@adminjs/prisma";
import { Organization, prisma } from "@cacta/db";
import { AccountCreated, sendEmail } from "@cacta/email";
import { createId } from "@paralleldrive/cuid2";
import { type ResourceWithOptions } from "adminjs";
import bcrypt from "bcryptjs";

export default {
  resource: { model: getModelByName("User"), client: prisma },
  options: {
    properties: {
      organization: {
        isRequired: true,
        type: "reference",
        reference: "Organization",
      },
    },
    listProperties: ["firstName", "lastName", "email", "pendingVerification"],
    filterProperties: ["firstName", "lastName", "email", "pendingVerification"],
    showProperties: ["id", "firstName", "lastName", "email", "pendingVerification", "organization"],
    editProperties: ["firstName", "lastName", "email", "organization"],
    navigation: null,
    actions: {
      edit: {
        isVisible: false,
      },
      show: {
        after: async (res: any) => {
          const user = await prisma.user.findUnique({
            where: { id: res.record.id },
            include: {
              organizations: true,
            },
          });

          if (!user) {
            throw new Error("User not found");
          }

          const organization = user.organizations[0]?.name;

          res.record.params = {
            ...res.record.params,
            organization,
          };

          return res;
        },
      },
      new: {
        after: async (res: any) => {
          const selectedOrganization: Organization = res.record.populated.organization.params;
          const createdUserId: string = res.record.id;

          const kpis = await prisma.kpi.findMany({ select: { id: true } });

          // Connect user to the selected organization
          const user = await prisma.user.update({
            where: { id: createdUserId },
            data: {
              organizations: {
                connect: {
                  id: selectedOrganization.id,
                },
              },
              homePageKpis: {
                connect: kpis,
              },
            },
          });

          const password = res.record.params.password;
          delete res.record.params.password;

          await sendEmail({
            to: user.email,
            subject: "Bienvenido/a a Cacta!",
            Email: AccountCreated,
            emailProps: {
              organizationName: selectedOrganization.name,
              password,
            },
          });

          return res;
        },
        before: async (request) => {
          const randomPassword = createId();
          request.payload = {
            ...request.payload,
            hashedPassword: await bcrypt.hash(randomPassword, 12),
            password: randomPassword,
          };

          return request;
        },
      },
    },
  },
} satisfies ResourceWithOptions;
