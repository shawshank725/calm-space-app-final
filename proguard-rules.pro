# --- General Android / Expo Rules ---
-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod
-dontwarn com.facebook.react.**
-keep class com.facebook.react.** { *; }

# --- React Native Reanimated (Crucial for JSI) ---
# Reanimated uses NDK/JNI to bridge JS and C++. Obfuscating these breaks the bridge.
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.core.** { *; }

# --- React Native Skia ---
# Skia also relies heavily on JNI bindings.
-keep class com.shopify.reactnative.skia.** { *; }

# --- Supabase / OkHttp / Retrofit (Networking) ---
# Prevents obfuscating the models used for JSON serialization
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-dontwarn com.google.gson.**
-keep class com.google.gson.** { *; }
-keep class com.google.gson.reflect.TypeToken { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# --- Supabase / PostgREST / Realtime ---
-keep class com.supabase.** { *; }
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**

# --- React Query / TanStack ---
# React Query is JS-only, but we keep the native timers and network listeners stable.
-keep class com.facebook.react.modules.network.** { *; }

# --- Expo Secure Store ---
# Required to ensure the encryption/decryption methods are not stripped.
-keep class expo.modules.securestore.** { *; }

# --- React Native SVG ---
-keep class com.horcrux.svg.** { *; }

# --- React Native View Shot ---
-keep class fr.greweb.reactnativeviewshot.** { *; }

# --- Optimization ---
# Strip debugging information from the native code
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
