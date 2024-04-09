/* eslint-disable jsx-a11y/alt-text */
import { Image, Page, Text, View } from "@react-pdf/renderer";

import { translateField } from "~/utils/getTranslation";
import { replaceSubscriptNumbers } from "~/utils/helperFunctions";
import { type ActivityInput } from "~/hooks/useProductScore";
import { COLORS, styles } from ".";

type EnvironmentalPerformanceProps = {
  activityData: ActivityInput;
};

const EnvironmentalPerformancePage = ({ activityData }: EnvironmentalPerformanceProps) => {
  let indexCount = 0;

  const totalKpis = activityData.activityInputs.reduce((acc, activityInput) => {
    return acc + activityInput.kpis.length;
  }, 0);

  return (
    <Page style={styles.page}>
      <View style={{ display: "flex", flexDirection: "column", gap: 35 }}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Performance ambiental:</Text>

          <Text style={styles.smallText}>
            Los resultados mostrados están referidos a la unidad funcional declarada.
          </Text>

          <View style={{ width: "100%" }}>
            <View style={styles.tableHeader}>
              <View style={styles.cell}>
                <Text>Parámetro</Text>
              </View>

              <View style={styles.cell}>
                <Text>Unidad</Text>
              </View>

              <View style={styles.cell}>
                <Text>Upstream</Text>
              </View>

              <View style={styles.cell}>
                <Text>Core</Text>
              </View>

              <View style={styles.cell}>
                <Text>Downstream</Text>
              </View>

              <View style={styles.lastCell}>
                <Text>Total</Text>
              </View>
            </View>

            {activityData.activityInputs.map(({ kpis }) =>
              kpis.map(({ kpiName, totals, unit }, index) => {
                indexCount++;
                return (
                  <View
                    key={index}
                    style={
                      indexCount === totalKpis
                        ? { ...styles.row, borderBottom: 1, borderBottomColor: COLORS.black }
                        : styles.row
                    }
                  >
                    <View style={styles.cell}>
                      <Text>{translateField(kpiName, "es")}</Text>
                    </View>

                    <View style={styles.cell}>
                      <Text>{replaceSubscriptNumbers(unit)}</Text>
                    </View>

                    <View style={styles.cell}>
                      <Text>{totals.upstream}</Text>
                    </View>

                    <View style={styles.cell}>
                      <Text>{totals.core}</Text>
                    </View>

                    <View style={styles.cell}>
                      <Text>MND</Text>
                    </View>

                    <View style={styles.lastCell}>
                      <Text>{totals.totalValue}</Text>
                    </View>
                  </View>
                );
              }),
            )}
            <Text style={(styles.smallText, { fontSize: 9 })}>MND: Módulo no declarado</Text>
          </View>
        </View>
      </View>
      <Image
        source="/images/pdf/cacta-logo.png"
        style={{ alignSelf: "flex-end", width: 80, height: 60 }}
      />
    </Page>
  );
};

export default EnvironmentalPerformancePage;
