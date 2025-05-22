import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type NavigationProp,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type StackActionHelpers,
  type StackNavigationState,
  StackRouter,
  type StackRouterOptions,
  type StaticConfig,
  type TypedNavigator,
  useNavigationBuilder,
} from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// Additional props accepted by the view
type StackNavigationConfig = {};

// Supported screen options
type StackNavigationOptions = {
  title?: string;
};

// Map of event name and the type of data (in event.data)
// canPreventDefault: true adds the defaultPrevented property to the
// emitted events.
type StackNavigationEventMap = {
  tabPress: {
    data: { isAlreadyFocused: boolean };
    canPreventDefault: true;
  };
};

// The props accepted by the component is a combination of 3 things
type Props = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  NavigationProp<ParamListBase>
> &
  StackRouterOptions &
  StackNavigationConfig;

const WizardNavigator = ({ ...rest }: Props) => {
  const { state, descriptors } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    StackNavigationOptions,
    StackNavigationEventMap
  >(StackRouter, rest);

  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const route = state.routes[state.index];

  const entering = isFirstRender.current
    ? FadeIn.duration(0)
    : FadeIn.duration(200).delay(400);

  return (
    <View>
      <Animated.View
        entering={entering}
        exiting={FadeOut.duration(200)}
        key={route.key}
      >
        {descriptors[route.key].render()}
      </Animated.View>
    </View>
  );
};

// The factory function with generic types for type-inference
export function createWizardNavigator<
  const ParamList extends ParamListBase,
  const NavigatorID extends string | undefined = undefined,
  const TypeBag extends NavigatorTypeBagBase = {
    ParamList: ParamList;
    NavigatorID: NavigatorID;
    State: StackNavigationState<ParamList>;
    ScreenOptions: StackNavigationOptions;
    EventMap: StackNavigationEventMap;
    NavigationList: {
      [RouteName in keyof ParamList]: NavigationProp<
        ParamList,
        RouteName,
        NavigatorID
      >;
    };
    Navigator: typeof WizardNavigator;
  },
  const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>
>(config?: Config): TypedNavigator<TypeBag, Config> {
  return createNavigatorFactory(WizardNavigator)(config);
}
