package com.xufagroup.cryptowallet;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.learnium.RNDeviceInfo.BuildConfig;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.peel.react.rnos.RNOSModule;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;

import com.oblador.vectoricons.VectorIconsPackage;
//import com.evollu.react.fcm.FIRMessagingPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.dscj.autoheightwebview.AutoHeightWebViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.reactnative.camera.RNCameraPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FBSDKPackage(mCallbackManager),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RNOSModule(),
            new RNFirebasePackage(),
              new RNFirebaseFirestorePackage(),
            new VectorIconsPackage(),
//            new FIRMessagingPackage(),
            new RNExitAppPackage(),
            new RNDeviceInfo(),
              new RNCameraPackage(),
            new AutoHeightWebViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
