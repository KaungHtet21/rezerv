import React from "react";
import { StyleSheet } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "react-query";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NetworkBannerProvider } from "~shared/presentation/components";
import { OfflineSyncProvider } from "~shared/infrastructure/offline";
import {
	GlobalBottomSheetProvider,
	GlobalBottomSheetView,
} from "~shared/presentation/layouts";
import { DesignSyncProvider } from "~shared/presentation/design";
import RootNavigator from "~app/navigation/RootNavigator";
import { queryClient } from "~shared/infrastructure/api/queryClient";
import store, { persistor } from "~shared/infrastructure/state/store";
import { ThemeProvider } from "./ThemeProvider";

const AppProviders: React.FC = () => (
  <GestureHandlerRootView style={styles.flex1}>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <ThemeProvider>
              <DesignSyncProvider>
                <BottomSheetModalProvider>
                  <GlobalBottomSheetProvider>
                    <NetworkBannerProvider>
                      <OfflineSyncProvider>
                        <RootNavigator />
                        <GlobalBottomSheetView />
                      </OfflineSyncProvider>
                    </NetworkBannerProvider>
                  </GlobalBottomSheetProvider>
                </BottomSheetModalProvider>
              </DesignSyncProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </PersistGate>
      </ReduxProvider>
    </QueryClientProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  flex1: { flex: 1 },
});

export default AppProviders;
