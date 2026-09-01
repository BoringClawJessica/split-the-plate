"use client";

import SplashScreen from "./screens/SplashScreen";
import SignInScreen from "./screens/SignInScreen";
import ProfileSetupScreen from "./screens/ProfileSetupScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import HomeScreen from "./screens/HomeScreen";
import FriendsScreen from "./screens/FriendsScreen";
import HomeEmptyScreen from "./screens/HomeEmptyScreen";
import NewSplitScreen from "./screens/NewSplitScreen";
import CameraScanScreen from "./screens/CameraScanScreen";
import ItemsDetectedScreen from "./screens/ItemsDetectedScreen";
import AddPeopleScreen from "./screens/AddPeopleScreen";
import SplitMethodScreen from "./screens/SplitMethodScreen";
import ByItemScreen from "./screens/ByItemScreen";
import CustomSplitScreen from "./screens/CustomSplitScreen";
import EvenSplitScreen from "./screens/EvenSplitScreen";
import ReviewConfirmScreen from "./screens/ReviewConfirmScreen";
import PaymentHandoffScreen from "./screens/PaymentHandoffScreen";
import GamblePickerScreen from "./screens/GamblePickerScreen";
import PlinkoScreen from "./screens/PlinkoScreen";
import RouletteScreen from "./screens/RouletteScreen";
import GambleResultsScreen from "./screens/GambleResultsScreen";
import SaveMealScreen from "./screens/SaveMealScreen";
import MealDetailScreen from "./screens/MealDetailScreen";
import MealHistoryScreen from "./screens/MealHistoryScreen";
import TableChatScreen from "./screens/TableChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import PaymentMethodsScreen from "./screens/PaymentMethodsScreen";
import PrivacyScreen from "./screens/PrivacyScreen";
import NotificationSettingsScreen from "./screens/NotificationSettingsScreen";
import {
  ReceiptNotFoundScreen,
  NoFriendsScreen,
  NoSplitsScreen,
  PaymentFailedScreen,
  OfflineBannerScreen,
} from "./screens/EdgeStates";
import ComingSoonScreen from "./screens/ComingSoonScreen";

export default function ScreenContent({ slug }: { slug: string }) {
  switch (slug) {
    case "splash": return <SplashScreen />;
    case "signin": return <SignInScreen />;
    case "profile-setup": return <ProfileSetupScreen />;
    case "notifications-permission": return <NotificationsScreen />;
    case "home": return <HomeScreen />;
    case "friends": return <FriendsScreen />;
    case "home-empty": return <HomeEmptyScreen />;
    case "new-split": return <NewSplitScreen />;
    case "camera-scan": return <CameraScanScreen />;
    case "items-detected": return <ItemsDetectedScreen />;
    case "add-people": return <AddPeopleScreen />;
    case "split-method": return <SplitMethodScreen />;
    case "by-item": return <ByItemScreen />;
    case "custom-split": return <CustomSplitScreen />;
    case "even-split": return <EvenSplitScreen />;
    case "review-confirm": return <ReviewConfirmScreen />;
    case "payment-handoff": return <PaymentHandoffScreen />;
    case "gamble-picker": return <GamblePickerScreen />;
    case "plinko": return <PlinkoScreen />;
    case "roulette": return <RouletteScreen />;
    case "gamble-results": return <GambleResultsScreen />;
    case "save-meal": return <SaveMealScreen />;
    case "meal-detail": return <MealDetailScreen />;
    case "meal-history": return <MealHistoryScreen />;
    case "table-chat": return <TableChatScreen />;
    case "profile": return <ProfileScreen />;
    case "settings": return <SettingsScreen />;
    case "payment-methods": return <PaymentMethodsScreen />;
    case "privacy": return <PrivacyScreen />;
    case "notification-settings": return <NotificationSettingsScreen />;
    case "receipt-not-found": return <ReceiptNotFoundScreen />;
    case "no-friends": return <NoFriendsScreen />;
    case "no-splits": return <NoSplitsScreen />;
    case "payment-failed": return <PaymentFailedScreen />;
    case "offline": return <OfflineBannerScreen />;
    default:
      // Coming Soon screens
      if (slug.endsWith("-preview")) return <ComingSoonScreen slug={slug} />;
      return (
        <div style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          background: "var(--bg-base)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16, color: "var(--brand-orange-from)" }}>—</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text)" }}>Coming Soon</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 8 }}>{slug}</div>
        </div>
      );
  }
}
