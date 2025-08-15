package com.chex_ai

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    override fun getMainComponentName(): String = "Chex_AI"


    /**
     * Returns the instance of the [ReactActivityDelegate]. We use
     * [DefaultReactActivityDelegate] which allows enabling Fabric and Concurrent React
     * (aka React 18) with two boolean flags [fabricEnabled].
     */

 override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
