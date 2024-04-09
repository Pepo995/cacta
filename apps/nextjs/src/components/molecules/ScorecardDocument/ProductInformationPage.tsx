/* eslint-disable jsx-a11y/alt-text */
import { type ReactNode } from "react";
import { type Organization } from "@cacta/db";
import { Image, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

import { type ProductCampaignToShow } from "~/hooks/useProductScore";
import { styles } from ".";

type ProductInformationPageProps = {
  productCampaignsToShow: ProductCampaignToShow;
  organization: Organization | null;
};

const ProductInformationPage = ({
  productCampaignsToShow,
  organization,
}: ProductInformationPageProps) => {
  type Styles = typeof styles;

  type TextPart = {
    text: string;
    style: Styles[keyof Styles];
  };

  type BulletPointProps = {
    bullet: string;
    children?: ReactNode;
    textParts?: TextPart[];
  };

  const BulletPoint = ({ bullet, children, textParts }: BulletPointProps) => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ marginHorizontal: 8 }}>{bullet}</Text>
      {!children ? (
        <View style={styles.spanContainer}>
          {textParts?.map((part, index) => (
            <Text key={index} style={part.style}>
              {part.text}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.smallText}>{children}</Text>
      )}
    </View>
  );

  const formatDate = (date: Date) => format(date, "dd/LL/yy");

  return (
    <>
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionContainer} fixed>
          <Text style={styles.sectionTitle}>Información de producto:</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <View style={styles.spanContainer}>
              <Text style={styles.smallTextBold}>Nombre de producto:</Text>
              <Text style={styles.smallText}>{productCampaignsToShow.productInSpanish}</Text>
            </View>

            <View style={styles.spanContainer}>
              <Text style={styles.smallTextBold}>Clasificación UN CPC:</Text>
              <Text style={styles.smallText}>
                {productCampaignsToShow.productCpcId} - {productCampaignsToShow.productCpcName}
              </Text>
            </View>

            <View style={styles.spanContainer}>
              <Text style={styles.smallTextBold}>Ubicación geográfica:</Text>
              <Text style={styles.smallText}>{organization?.country}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer} fixed>
          <Text style={styles.sectionTitle}>Información del Análisis de Ciclo de Vida (ACV):</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <Text style={styles.smallTextBold}>
              Unidad funcional / declarada:{"  "}
              <Text style={{ ...styles.smallText, fontFamily: "Poppins" }} break>
                1.00 kg en estado fresco.
              </Text>
            </Text>

            <Text style={styles.smallTextBold}>
              Vida útil de referencia:{"  "}
              <Text style={{ ...styles.smallText, fontFamily: "Poppins" }} break>
                No aplicable.
              </Text>
            </Text>

            <Text style={styles.smallTextBold}>
              Cobertura temporal:{"  "}
              <Text style={{ ...styles.smallText, fontFamily: "Poppins" }} break>
                {formatDate(productCampaignsToShow.startDate)} hasta{" "}
                {productCampaignsToShow.endDate ? formatDate(productCampaignsToShow.endDate) : ""}
              </Text>
            </Text>

            <Text style={styles.smallTextBold}>
              Bases de datos y software utilizado:{"  "}
              <Text style={{ ...styles.smallText, fontFamily: "Poppins" }} break>
                La información secundaria utilizada en el modelo de cálculo fue obtenida de
                Ecoinvent v3.9, implementada en el software Cacta Agro.
              </Text>
            </Text>

            <Text style={styles.smallTextBold}>
              Límites del sistema:{"  "}
              <Text style={{ ...styles.smallText, fontFamily: "Poppins" }} break>
                “De la cuna hasta la tranquera”.
              </Text>
            </Text>

            <View style={{ display: "flex", flexDirection: "column", paddingHorizontal: "48px" }}>
              <Image
                source="/images/pdf/SystemBoundary.jpg"
                style={{ width: 400, height: 280, marginTop: "15px" }}
              />
              <Text style={{ fontSize: 8 }} break>
                Figura 1: Esquema de los límites del sistema considerados
              </Text>
            </View>
          </View>
        </View>

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ display: "flex", flexDirection: "column" }}>
            <View style={styles.line} />

            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Text style={{ fontSize: 6 }}>1</Text>
              <Text style={{ fontSize: 8 }}>
                PCR 2020:07, Arable Vegetables and Crops. PCR 2019:01, Fruits and Nuts.
              </Text>
            </View>
          </View>

          <Image
            source="/images/pdf/cacta-logo.png"
            style={{ alignSelf: "flex-end", width: 80, height: 60 }}
          />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.sectionContainer} fixed>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <Text style={{ ...styles.smallText, fontFamily: "Poppins" }} break>
              El presente análisis cubre desde la extracción de materias primas hasta el producto
              cosechado. Los cálculos han seguido la metodología de ACV, en particular lo dispuesto
              por el WFLDB v3.5. De acuerdo a las reglas de cálculo PCR se distinguen las siguientes
              fases:
            </Text>
          </View>

          <View style={{ width: 400, paddingLeft: "15px" }}>
            <View style={{ flexDirection: "column" }}>
              <BulletPoint
                textParts={[
                  { text: "Upstream", style: styles.smallTextBold },
                  { text: "o aguas arriba, incluye:", style: styles.smallText },
                ]}
                bullet="•"
              />

              <View style={{ width: 400, paddingLeft: "15px" }}>
                <BulletPoint bullet="—">
                  Producción de fertilizantes, agroquímicos y semillas
                </BulletPoint>

                <BulletPoint bullet="—">
                  Producción de otros insumos (combustibles, repuestos, etc.)
                </BulletPoint>
              </View>
            </View>

            <View style={{ flexDirection: "column" }}>
              <BulletPoint
                textParts={[
                  { text: "Core", style: styles.smallTextBold },
                  { text: "o actividades en campo, incluye:", style: styles.smallText },
                ]}
                bullet="•"
              />

              <View style={{ width: 400, paddingLeft: "15px" }}>
                <BulletPoint bullet="—">Uso de agua</BulletPoint>

                <BulletPoint bullet="—">Transporte de insumos hacia el campo</BulletPoint>

                <BulletPoint bullet="—">Impacto debido al uso de electricidad</BulletPoint>

                <BulletPoint bullet="—">Emisiones directas del uso de combustibles</BulletPoint>

                <BulletPoint bullet="—">
                  Emisiones directas por el uso de fertilizantes y agroquímicos
                </BulletPoint>

                <BulletPoint bullet="—">
                  Actividades en el campo (siembra, pulverizaciones, cosecha)
                </BulletPoint>
              </View>
            </View>

            <View style={{ flexDirection: "column" }}>
              <BulletPoint
                textParts={[
                  { text: "Downstream", style: styles.smallTextBold },
                  { text: "o aguas abajo:", style: styles.smallText },
                ]}
                bullet="•"
              />

              <View style={{ flexDirection: "column", width: 400, paddingLeft: "15px" }}>
                <BulletPoint bullet="—">No consideradas en el presente análisis</BulletPoint>
              </View>
            </View>
          </View>

          <Text style={styles.smallText}>
            No se consideran en el presente análisis la infraestructura o producción de maquinaria
            agrícola.
          </Text>
        </View>

        <Image
          source="/images/pdf/cacta-logo.png"
          style={{ alignSelf: "flex-end", width: 80, height: 60 }}
        />
      </Page>
    </>
  );
};

export default ProductInformationPage;
