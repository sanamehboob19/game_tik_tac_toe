package com.nzdeveloper.tictactoe.twoplayerxoxo.puzzlegame;

import android.content.Context;
import android.net.ConnectivityManager;
import android.util.Log;
import android.view.View;

/**
 * Amazon / Fire TV flavor stub for UtilsAdmob.
 *
 * Google Play Services (GMS) is NOT available on Amazon Fire TV, Fire Tablets,
 * or BMW Theatre Screens. This stub replaces the full GMS AdMob implementation
 * so the app compiles and installs correctly on those devices.
 *
 * IMPORTANT: All method signatures MUST exactly match those in the google-flavor
 * UtilsAdmob.java so that shared code (MainActivity, UtilsAwv, UtilsManager)
 * compiles against both flavors without changes.
 *
 * All ad methods are intentionally no-ops — ads are always disabled on Amazon builds.
 */
public class UtilsAdmob {
    // Ads always disabled on Amazon
    protected Boolean is_testing = false;
    protected String system = "00";
    protected Boolean enable_banner = false;
    protected Boolean enable_inter  = false;
    protected Boolean enable_reward = false;
    protected Boolean banner_at_bottom = true;
    protected Boolean banner_not_overlap = false;
    protected Object mAdView = null;           // no AdView on Amazon
    protected MainActivity activity;
    protected Object mInterstitialAd = null;
    protected Object mRewardedAd = null;
    protected String is_rewarded = "no";

    public void setContext(MainActivity act) {
        activity = act;
    }

    /** Called from UtilsManager.init() — no-op on Amazon */
    public void init() {
        Log.d("UtilsAdmob", "Amazon build: ads disabled (no Google Play Services)");
        // Hide the adView stub so it takes no space
        if (activity != null) {
            activity.runOnUiThread(() -> {
                View adView = activity.findViewById(R.id.adView);
                if (adView != null) adView.setVisibility(View.GONE);
            });
        }
    }

    /** Called from UtilsManager / UtilsAwv — no-op on Amazon */
    protected void show_banner(Boolean visible) {
        // No-op
    }

    protected void prepare_banner() {
        // No-op
    }

    protected void prepare_inter() {
        // No-op
    }

    /** Called from UtilsAwv — no-op on Amazon */
    public void show_inter() {
        Log.d("UtilsAdmob", "Amazon build: interstitial ad skipped");
    }

    public void prepare_reward() {
        // No-op
    }

    /** Called from UtilsAwv — no-op on Amazon */
    public void show_reward() {
        Log.d("UtilsAdmob", "Amazon build: reward ad skipped");
    }

    /** Called from MainActivity.onResume() */
    public void on_resume() {
        // No-op
    }

    /** Called from MainActivity.onPause() */
    public void on_pause() {
        // No-op
    }

    /** Called from MainActivity.onDestroy() */
    public void on_destroy() {
        // No-op
    }

    public void disable_sounds(boolean val) {
        // No-op
    }

    public String gdpr_personalized_ads() {
        return "0";
    }

    @SuppressWarnings("deprecation")
    public boolean isConnectionAvailable() {
        ConnectivityManager cm = (ConnectivityManager) activity.getSystemService(Context.CONNECTIVITY_SERVICE);
        return (cm.getActiveNetworkInfo() != null && cm.getActiveNetworkInfo().isConnectedOrConnecting());
    }

    public String md5(String s) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("MD5");
            digest.update(s.getBytes());
            byte[] messageDigest = digest.digest();
            StringBuilder hexString = new StringBuilder();
            for (byte b : messageDigest) hexString.append(Integer.toHexString(0xFF & b));
            return hexString.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return "";
    }
}
