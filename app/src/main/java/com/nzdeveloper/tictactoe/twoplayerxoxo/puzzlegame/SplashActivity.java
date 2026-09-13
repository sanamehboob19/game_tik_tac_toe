package com.nzdeveloper.tictactoe.twoplayerxoxo.puzzlegame;

import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.nzdeveloper.tictactoe.twoplayerxoxo.puzzlegame.R;

@SuppressLint("CustomSplashScreen")
public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DURATION_MS = 3000; // 3 seconds total

    private ProgressBar progressBar;
    private ProgressBar progressBarGlow;
    private TextView txtPercent;
    private TextView txtLoading;

    private ValueAnimator progressAnimator;
    private ValueAnimator dotAnimator;
    private final Handler handler = new Handler(Looper.getMainLooper());

    // Loading dots animation strings
    private final String[] loadingDots = {
        "Loading.", "Loading..", "Loading...", "Loading.."
    };
    private int dotIndex = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Full screen - hide status bar & navigation bar (modern API)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat insetsController =
            new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        insetsController.hide(WindowInsetsCompat.Type.systemBars());
        insetsController.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );

        setContentView(R.layout.activity_splash);

        // Find views
        progressBar     = findViewById(R.id.progress_bar);
        progressBarGlow = findViewById(R.id.progress_bar_glow);
        txtPercent      = findViewById(R.id.txt_percent);
        txtLoading      = findViewById(R.id.txt_loading);
        android.widget.ImageView splashIcon = findViewById(R.id.splash_icon);

        // Start animations
        startProgressAnimation();
        startLoadingDotsAnimation();
        startIconPulse(splashIcon);

        // Navigate to MainActivity after splash
        handler.postDelayed(this::goToMain, SPLASH_DURATION_MS);

        // Disable back press on splash (modern API)
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                // Do nothing — disable back press during splash
            }
        });
    }

    /**
     * Animates the neon progress bar from 0 → 100 with easing
     */
    private void startProgressAnimation() {
        progressAnimator = ValueAnimator.ofInt(0, 100);
        progressAnimator.setDuration(SPLASH_DURATION_MS - 200);
        progressAnimator.setInterpolator(new AccelerateDecelerateInterpolator());
        progressAnimator.addUpdateListener(animation -> {
            int value = (int) animation.getAnimatedValue();

            // Update both progress bars (main + glow)
            progressBar.setProgress(value);
            progressBarGlow.setProgress(value);

            // Update percentage text
            txtPercent.setText(value + "%");

            // Pulse the glow alpha for neon flicker effect
            float glowAlpha = 0.3f + 0.4f * (float) Math.abs(Math.sin(value * 0.1));
            progressBarGlow.setAlpha(glowAlpha);
        });
        progressAnimator.start();
    }

    /**
     * Cycles through "Loading." / "Loading.." / "Loading..." with pulsing alpha
     */
    private void startLoadingDotsAnimation() {
        final int interval = 400; // ms between dot changes

        Runnable dotRunnable = new Runnable() {
            @Override
            public void run() {
                if (txtLoading != null && !isFinishing()) {
                    txtLoading.setText(loadingDots[dotIndex % loadingDots.length]);
                    dotIndex++;
                    handler.postDelayed(this, interval);
                }
            }
        };
        handler.post(dotRunnable);

        // Pulse alpha animation on loading text
        ValueAnimator alphaAnim = ValueAnimator.ofFloat(0.6f, 1.0f);
        alphaAnim.setDuration(800);
        alphaAnim.setRepeatMode(ValueAnimator.REVERSE);
        alphaAnim.setRepeatCount(ValueAnimator.INFINITE);
        alphaAnim.addUpdateListener(anim -> {
            if (txtLoading != null) {
                txtLoading.setAlpha((float) anim.getAnimatedValue());
            }
        });
        alphaAnim.start();
        dotAnimator = alphaAnim;
    }

    /**
     * Gentle breathing pulse animation on the app icon
     */
    private void startIconPulse(android.widget.ImageView icon) {
        if (icon == null) return;
        ValueAnimator pulseAnim = ValueAnimator.ofFloat(0.92f, 1.08f);
        pulseAnim.setDuration(1000);
        pulseAnim.setRepeatMode(ValueAnimator.REVERSE);
        pulseAnim.setRepeatCount(ValueAnimator.INFINITE);
        pulseAnim.setInterpolator(new AccelerateDecelerateInterpolator());
        pulseAnim.addUpdateListener(anim -> {
            float scale = (float) anim.getAnimatedValue();
            icon.setScaleX(scale);
            icon.setScaleY(scale);
        });
        pulseAnim.start();
    }

    private void goToMain() {
        Intent intent = new Intent(SplashActivity.this, MainActivity.class);
        startActivity(intent);
        // Smooth fade transition
        getWindow().getDecorView().animate()
            .alpha(0f)
            .setDuration(300)
            .withEndAction(this::finish)
            .start();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Clean up to avoid memory leaks
        handler.removeCallbacksAndMessages(null);
        if (progressAnimator != null) progressAnimator.cancel();
        if (dotAnimator != null)     dotAnimator.cancel();
    }
}
