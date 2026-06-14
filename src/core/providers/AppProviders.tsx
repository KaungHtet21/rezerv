import React from "react";
import { StyleSheet } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "react-query";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NetworkBannerProvider } from "~app/components";
import { OfflineSyncProvider } from "~core/offline";
import {
	GlobalBottomSheetProvider,
	GlobalBottomSheetView,
} from "~app/layouts";
import { DesignSyncProvider } from "~core/design";
import RootNavigator from "~core/navigation/RootNavigator";
import { queryClient } from "~core/server/queryClient";
import store, { persistor } from "~core/store/store";
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
