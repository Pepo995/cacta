/* eslint-disable jsx-a11y/alt-text */
import { type Organization } from "@cacta/db";
import { Image, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

import { type ProductCampaignToShow } from "~/hooks/useProductScore";
import { styles } from ".";

type CoverPageProps = {
  productCampaignsToShow: ProductCampaignToShow;
  organization: Organization | null;
};

const CoverPage = ({ productCampaignsToShow, organization }: CoverPageProps) => {
  const actualDate = format(new Date(), "dd/LL/yyyy");
  const logo = organization?.imageUrl;

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ display: "flex", flexDirection: "column" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.header} fixed>
            <Text style={styles.title}>TARJETA AMBIENTAL DE PRODUCTO</Text>
          </View>

          {logo && <Image source={logo} style={{ width: 100 }} />}
        </View>

        <View style={styles.firstPageContainer}>
          <View style={{ display: "flex", flexDirection: "row", gap: "6px" }}>
            <Text style={{ fontFamily: "Poppins" }}>Producto:</Text>

            <Text style={{ fontFamily: "PoppinsBold" }}>
              {productCampaignsToShow.productInSpanish}
            </Text>
          </View>

          <View style={{ display: "flex", flexDirection: "row", gap: "6px" }}>
            <Text style={{ fontFamily: "Poppins" }}>Organización:</Text>

            <Text style={{ fontFamily: "PoppinsBold" }}>{organization?.name}</Text>
          </View>

          <View style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: "10px" }}>
            <Text style={styles.smallText}>Id de Proyecto: {productCampaignsToShow.projectId}</Text>

            <Text style={styles.smallText}>Fecha de generación: {actualDate}</Text>

            <View style={styles.imageContainer}>
              <Image source="/images/pdf/field.jpg" style={{ width: 500, height: 400 }} />
            </View>
          </View>
        </View>
      </View>

      <Image
        source="/images/pdf/cacta-logo.png"
        style={{ alignSelf: "center", width: 100, height: 80 }}
      />
    </Page>
  );
};

export default CoverPage;
