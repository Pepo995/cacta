/* eslint-disable jsx-a11y/alt-text */
import { Image, Page, Text, View } from "@react-pdf/renderer";

import { type ProductCampaignToShow } from "~/hooks/useProductScore";
import { COLORS, styles } from ".";

type AdditionalInformationProps = {
  productCampaignsToShow: ProductCampaignToShow;
};

const AdditionalInformationPage = ({ productCampaignsToShow }: AdditionalInformationProps) => {
  const BulletPointSpan = ({
    textPartBold,
    textPart,
  }: {
    textPartBold: string;
    textPart: string;
  }) => (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Text style={{ marginHorizontal: 8, alignSelf: "flex-start" }}>•</Text>

      <Text style={{ ...styles.smallTextBold, marginTop: 5 }}>
        {textPartBold}
        {"  "}
        <Text style={{ ...styles.smallText, fontFamily: "Poppins" }} break>
          {textPart}
        </Text>
      </Text>
    </View>
  );

  return (
    <Page style={styles.page}>
      <View style={{ display: "flex", flexDirection: "column", gap: 35 }}>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <Text style={styles.smallTextBold}>Información adicional:</Text>

          <View>
            <BulletPointSpan
              textPartBold="Cut-off:"
              textPart="Se desprecian las actividades que representan menos de 1% del impacto ambiental final."
            />

            <BulletPointSpan
              textPartBold="Allocation o reglas de asignación:"
              textPart="Se adopta como regla general la asignación por subdivisión (ISO 14040/44). En los casos que sea imposible se adopta la asignación por masa."
            />

            <BulletPointSpan
              textPartBold="Calidad de la información:"
              textPart="La información principal utilizada ha sido tomada directamente del sistema de gestión, cumpliendo con la normativa ISO 14040/44. Adicionalmente se realiza el análisis de calidad de información según WFLDB, presentado en el informe de sustentabilidad organizacional. Los cálculos adicionales acerca de las emisiones contempladas están descriptos en la documentación general de la herramienta, cumpliendo con el WFLDB v3.5 y el PCR correspondiente."
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Declaración de contenido:</Text>

          <Text style={styles.smallTextBold}>Producto</Text>

          <View style={{ width: "100%" }}>
            <View style={styles.tableHeader}>
              <View style={styles.cell}>
                <Text>Materiales / sustancias químicas</Text>
              </View>

              <View style={styles.cell}>
                <Text>Kg</Text>
              </View>

              <View style={styles.cell}>
                <Text>%</Text>
              </View>

              <View style={styles.lastCell}>
                <Text>Propiedades peligrosas</Text>
              </View>
            </View>

            <View style={{ ...styles.row, borderBottom: 1, borderBottomColor: COLORS.black }}>
              <View style={styles.cell}>
                <Text>{productCampaignsToShow.productInSpanish}</Text>
              </View>

              <View style={styles.cell}>
                <Text>1.00</Text>
              </View>

              <View style={styles.cell}>
                <Text>100</Text>
              </View>

              <View style={styles.lastCell}>
                <Text>-</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.spanContainer}>
          <Text style={styles.smallTextBold}>Empaquetado:</Text>

          <Text style={styles.smallText} break>
            Sin empaquetar
          </Text>
        </View>
      </View>

      <Image
        source="/images/pdf/cacta-logo.png"
        style={{ alignSelf: "flex-end", width: 80, height: 60 }}
      />
    </Page>
  );
};

export default AdditionalInformationPage;
