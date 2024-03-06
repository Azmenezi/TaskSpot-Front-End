/**
 * Automatically generated by expo-modules-autolinking.
 *
 * This autogenerated class provides a list of classes of native Expo modules,
 * but only these that are written in Swift and use the new API for creating Expo modules.
 */

import ExpoModulesCore
import ExpoBlur
import EXConstants
import ExpoImagePicker
import ExpoKeepAwake
import ExpoSecureStore

@objc(ExpoModulesProvider)
public class ExpoModulesProvider: ModulesProvider {
  public override func getModuleClasses() -> [AnyModule.Type] {
    return [
      BlurViewModule.self,
      ConstantsModule.self,
      ImagePickerModule.self,
      KeepAwakeModule.self,
      SecureStoreModule.self
    ]
  }

  public override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
    return [
    ]
  }

  public override func getReactDelegateHandlers() -> [ExpoReactDelegateHandlerTupleType] {
    return [
    ]
  }
}
