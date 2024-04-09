/* eslint-disable jsx-a11y/alt-text */
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { type ActivityInput, type ProductCampaignToShow } from "~/hooks/useProductScore";
import AdditionalInformationPage from "./AdditionalInformationPage";
import CoverPage from "./CoverPage";
import EnvironmentalPerformancePage from "./EnvironmentalPerformancePage";
import ProductInformationPage from "./ProductInformationPage";
import ReferencePage from "./ReferencePage";

type EcoscoreDocumentProps = {
  productCampaignsToShow: ProductCampaignToShow | undefined;
  activityData: ActivityInput | undefined;
};

export const COLORS = {
  black: "#000000",
  lightGreen: "#3bc9a3",
  white: "#ffffff",
  gray: "gray/500",
  secondary: "#8E33FF",
};

Font.register({
  family: "Poppins",
  src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJDUc1NECPY.ttf",
});

Font.register({
  family: "PoppinsBold",
  src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6V1tvFP-KUEg.ttf",
});

export const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 50,
    fontFamily: "Poppins",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "PoppinsBold",
    color: COLORS.secondary,
  },
  header: {
    display: "flex",
    flexDirection: "column",
  },
  smallText: {
    fontSize: 11,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  smallTextBold: {
    fontSize: 11,
    fontFamily: "PoppinsBold",
  },
  firstPageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginTop: "10px",
    alignItems: "flex-start",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: COLORS.secondary,
  },
  spanContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
  },
  line: {
    borderBottomColor: COLORS.gray,
    width: "100px",
    borderBottomWidth: "0.4px",
    marginBottom: 10,
    marginTop: 10,
  },
  sectionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  tableHeader: {
    display: "flex",
    fontFamily: "PoppinsBold",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    color: COLORS.black,
    borderTop: 1,
    borderTopColor: COLORS.black,
    borderRight: 1,
    borderRightColor: COLORS.black,
    borderLeft: 1,
    borderLeftColor: COLORS.black,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14,
    borderTop: 1,
    borderTopColor: COLORS.black,
    borderLeft: 1,
    borderLeftColor: COLORS.black,
    borderRight: 1,
    borderRightColor: COLORS.black,
  },
  cell: {
    width: "50%",
    textAlign: "center",
    fontSize: 10,
    borderRight: 1,
    borderRightColor: COLORS.black,
    height: "100%",
  },
  lastCell: {
    width: "50%",
    textAlign: "center",
    fontSize: 10,
  },
});

const ScorecardDocument = ({ productCampaignsToShow, activityData }: EcoscoreDocumentProps) => (
  <Document>
    {!productCampaignsToShow || !activityData ? (
      <Page size="A4" style={styles.page}>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Text>Error: no se obtuvo información para agregar al PDF.</Text>
        </View>
      </Page>
    ) : (
      <>
        <CoverPage
          organization={activityData.organization}
          productCampaignsToShow={productCampaignsToShow}
        />

        <ProductInformationPage
          productCampaignsToShow={productCampaignsToShow}
          organization={activityData.organization}
        />

        <AdditionalInformationPage productCampaignsToShow={productCampaignsToShow} />

        <EnvironmentalPerformancePage activityData={activityData} />

        <ReferencePage />
      </>
    )}
  </Document>
);

export default ScorecardDocument;
