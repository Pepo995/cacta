/* eslint-disable jsx-a11y/alt-text */
import { Image, Link, Page, Text, View } from "@react-pdf/renderer";

import { styles } from ".";

const ReferencePage = () => (
  <Page style={styles.page}>
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Referencias:</Text>

      <View style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
          <Text style={{ ...styles.smallTextBold, width: "50%" }}>
            PCR: Arable and Vegetable Crops
          </Text>

          <Text style={{ ...styles.smallText, width: "50%" }}>
            PCR 2020:07 Arable And Vegetable Crops (Version1.0) 2020/07,{" "}
            <Link src="www.environdec.com" style={{ fontSize: 11 }}>
              www.environdec.com
            </Link>
          </Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
          <Text style={{ ...styles.smallTextBold, width: "50%" }}>ISO 14040/44</Text>

          <Text style={{ ...styles.smallText, width: "50%" }}>
            Environmental management – Life cycle assessment principles and framework (ISO
            14040:2006) and Requirements and guidelines (ISO 14044:2006)
          </Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
          <Text style={{ ...styles.smallTextBold, width: "50%" }}>ISO 14025:2006</Text>

          <Text style={{ ...styles.smallText, width: "50%" }}>
            Environmental labels and declarations – Type III Environmental declarations – Principles
            and procedures
          </Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
          <Text style={{ ...styles.smallTextBold, width: "50%" }}>Ecoinvent (v3.9)</Text>

          <Text style={{ ...styles.smallText, width: "50%" }}>
            Ecoinvent Centre,{" "}
            <Link src="www.ecoinvent.org" style={{ fontSize: 11 }}>
              www.ecoinvent.org
            </Link>
          </Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row", gap: 30 }}>
          <Text style={{ ...styles.smallTextBold, width: "50%" }}>WFLDB (v3.5)</Text>

          <Text style={{ ...styles.smallText, width: "50%" }}>
            World Food LCA Database; www.quantis-intl.com/metrics/databases/wfldb-food
          </Text>
        </View>
      </View>
    </View>
    <Image
      source="/images/pdf/cacta-logo.png"
      style={{ alignSelf: "flex-end", width: 80, height: 60 }}
    />
  </Page>
);

export default ReferencePage;
