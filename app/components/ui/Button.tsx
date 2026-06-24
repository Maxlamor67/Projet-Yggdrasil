import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

// Couleurs communes
export const ButtonColors = {
  primary: "#00C853",
  primaryLight: "#34ea8c",
  danger: "#D32F2F",
  dangerLight: "#FF5252",
  dangerDark: "#B71C1C",
  secondary: "#666",
  secondaryLight: "#888",
  dark: "#222",
  light: "#f0f0f0",
  white: "#ffffff",
} as const;

type ButtonVariant = "primary" | "danger" | "secondary" | "outline" | "outlineDanger";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

const getGradientColors = (variant: ButtonVariant): [string, string] => {
  switch (variant) {
    case "primary":
      return [ButtonColors.primaryLight, ButtonColors.primary];
    case "danger":
      return [ButtonColors.dangerLight, ButtonColors.danger];
    case "secondary":
      return [ButtonColors.secondaryLight, ButtonColors.secondary];
    default:
      return [ButtonColors.primaryLight, ButtonColors.primary];
  }
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const isOutline = variant === "outline" || variant === "outlineDanger";

  const getOutlineStyle = (): ViewStyle => {
    if (variant === "outline") {
      return {
        borderWidth: 1,
        borderColor: ButtonColors.primary,
      };
    }
    if (variant === "outlineDanger") {
      return {
        borderWidth: 1,
        borderColor: ButtonColors.danger,
      };
    }
    return {};
  };

  const getTextVariantStyle = (): TextStyle => {
    switch (variant) {
      case "outline":
        return { color: ButtonColors.primary };
      case "outlineDanger":
        return { color: ButtonColors.danger };
      default:
        return { color: ButtonColors.white };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "small":
        return { paddingVertical: 6, paddingHorizontal: 10 };
      case "medium":
        return { paddingVertical: 8, paddingHorizontal: 14 };
      case "large":
        return { paddingVertical: 10, paddingHorizontal: 18 };
      default:
        return { paddingVertical: 8, paddingHorizontal: 14 };
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case "small":
        return { fontSize: 12 };
      case "medium":
        return { fontSize: 14 };
      case "large":
        return { fontSize: 16 };
      default:
        return { fontSize: 14 };
    }
  };

  const content = loading ? (
    <ActivityIndicator
      size="small"
      color={isOutline ? (variant === "outlineDanger" ? ButtonColors.danger : ButtonColors.primary) : ButtonColors.white}
    />
  ) : (
    <>
      {icon && icon}
      <Text
        style={[
          styles.buttonText,
          getTextVariantStyle(),
          getTextSizeStyle(),
          icon ? styles.textWithIcon : null,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </>
  );

  if (isOutline) {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          getSizeStyle(),
          getOutlineStyle(),
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[fullWidth && styles.fullWidth, disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={getGradientColors(variant)}
        style={[
          styles.button,
          getSizeStyle(),
          fullWidth && styles.fullWidth,
        ]}
      >
        {content}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontWeight: "700",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  textWithIcon: {
    marginLeft: 6,
  },
});
