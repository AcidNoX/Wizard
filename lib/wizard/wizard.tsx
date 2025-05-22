import {
  NavigationContainer,
  NavigationIndependentTree,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useShell } from "../shell";
import { createWizardNavigator } from "./navigator";

type WizardNavigatorParamList = {
  wizard: undefined;
  wizard2: undefined;
  wizard3: undefined;
};
type WizardNavigatorNavigationProp = NavigationProp<WizardNavigatorParamList>;
const WizardNavigator = createWizardNavigator<WizardNavigatorParamList>();
const useWizardNavigation = () =>
  useNavigation<WizardNavigatorNavigationProp>();

const Button = (props: { title: string; onPress: () => void }) => {
  return (
    <Pressable
      style={{ padding: 16, backgroundColor: "lightblue", borderRadius: 16 }}
      onPress={props.onPress}
    >
      <Text style={{ color: "white" }}>{props.title}</Text>
    </Pressable>
  );
};

const WizardScreen = () => {
  const navigation = useWizardNavigation();
  return (
    <View>
      <Text>Wizard</Text>
      <Button title="Next" onPress={() => navigation.navigate("wizard2")} />
    </View>
  );
};

const WizardScreen2 = () => {
  const navigation = useWizardNavigation();
  return (
    <View>
      <Text>Wizard2</Text>
      <Text>Wizard2</Text>
      <Text>Wizard2</Text>
      <Text>Wizard2</Text>
      <Button title="Next" onPress={() => navigation.navigate("wizard3")} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const WizardScreen3 = () => {
  const navigation = useWizardNavigation();
  const [showMore, setShowMore] = useState(false);
  const { closeShell } = useShell();
  return (
    <View>
      <Text>Wizard3</Text>
      <Text>Wizard3</Text>
      <Text>Wizard3</Text>
      <Text>Wizard3</Text>
      <Text>Wizard3</Text>
      <Text>Wizard3</Text>
      {showMore && (
        <>
          <Text>Wizard3</Text>
          <Text>Wizard3</Text>
          <Text>Wizard3</Text>
        </>
      )}
      <Button title="More" onPress={() => setShowMore((v) => !v)} />
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Button title="Close" onPress={closeShell} />
    </View>
  );
};

export const Wizard = () => {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <WizardNavigator.Navigator>
          <WizardNavigator.Screen name="wizard" component={WizardScreen} />
          <WizardNavigator.Screen name="wizard2" component={WizardScreen2} />
          <WizardNavigator.Screen name="wizard3" component={WizardScreen3} />
        </WizardNavigator.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};
