package com.nzdeveloper.tictactoe.twoplayerxoxo.puzzlegame;

import android.app.Activity;
import android.util.Log;

/**
 * Amazon / Fire TV flavor stub for Gdpr (User Messaging Platform).
 *
 * Google's UMP SDK requires Google Play Services which is NOT available on
 * Amazon Fire TV devices. This stub replaces the full UMP implementation so the
 * app installs and runs on Amazon devices without crashing.
 *
 * GDPR consent is intentionally skipped on Amazon builds.
 */
public class Gdpr {

    public void make(Activity activity) {
        // No UMP/GMS available on Amazon devices — skip GDPR consent silently
        Log.d("Gdpr", "Amazon build: GDPR consent skipped (no GMS available)");
    }

    public void loadForm() {
        // No-op
    }
}
