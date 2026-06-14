import { FC, PropsWithChildren } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export type TouchableItemProps = PropsWithChildren<
  {
    activeOpacity?: number;
  } & TouchableOpacityProps
>;

const TouchableItem: FC<TouchableItemProps> = ({ children, activeOpacity = 0.8, ...props }) => {
  return (
    <TouchableOpacity activeOpacity={activeOpacity} {...props} hitSlop={10}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableItem;
