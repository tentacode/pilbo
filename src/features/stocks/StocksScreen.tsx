import { router } from "expo-router";
import { View } from "react-native";

import { Button } from "@/design-system/components/Button/Button";
import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { StocksEmptyState } from "./components/StocksEmptyState";
import { StockSection } from "./components/StockSection";
import { useStocksData } from "./hooks/useStocksData";
import { styles } from "./StocksScreen.styles";

function openStockMedPicker() {
  router.push("/stock/med-picker");
}

function openStock(medId: string) {
  router.push({ pathname: "/stock", params: { medId } });
}

export function StocksScreen() {
  const { sections, isEmpty } = useStocksData();

  return (
    <Screen>
      <ScreenHeader title="Stock" />
      {isEmpty ? <StocksEmptyState /> : null}
      <View style={[styles.content, isEmpty && styles.emptyContent]}>
        {sections.low.length > 0 ? (
          <StockSection title="Stock bas" stockItems={sections.low} onStockPress={openStock} />
        ) : null}
        {sections.sufficient.length > 0 ? (
          <StockSection
            title="Suffisant"
            stockItems={sections.sufficient}
            onStockPress={openStock}
          />
        ) : null}
        <View style={styles.actions}>
          <Button label="Stock d’un médicament" icon="plus" onPress={openStockMedPicker} />
        </View>
      </View>
    </Screen>
  );
}
