package com.nzdeveloper.tictactoe.twoplayerxoxo.puzzlegame;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.CountDownTimer;
import android.text.Html;
import android.text.SpannableString;
import android.text.Spanned;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.Toast;

import static java.lang.Thread.sleep;

import androidx.annotation.NonNull;


import com.nzdeveloper.tictactoe.twoplayerxoxo.puzzlegame.R;

public class UtilsManager extends UtilsAdmob {
    private CountDownTimer splashTimer = null;


    public UtilsManager(MainActivity activity) {
        setContext(activity);
        this.activity = activity;
    }

    public String action(String query){
        String[] action = query.split("\\|");
        String result = "ok";
        switch (action[0]){
            case "show_splash":
                splash(true);
                break;
            case "hide_splash":
                splash(false);
                break;
            case "show_privacy":
                Intent myIntent = new Intent(activity, PrivacyActivity.class);
                activity.startActivity(myIntent);
                break;
            case "go_back":
                go_back();
                break;
            case "show_toast":
                showToast(action[1], activity);
                break;
            case "show_banner":
                show_banner(true);
                break;
            case "exit_game":
                exit_game();
                break;
            case "show_more":
                more_games();
                break;
            case "show_rate":
                rate();
                break;
            case "show_share":
                share();
                break;
        }
        return result;
    }

    @SuppressWarnings("deprecation")
    public static Spanned extractHtml(String html){
        if(html == null){
            // return an empty spannable if the html is null
            return new SpannableString("");
        }else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            return Html.fromHtml(html, Html.FROM_HTML_MODE_LEGACY);
        } else {
            return Html.fromHtml(html);
        }
    }

    public void showToast(String toast, Context context) {
        Toast.makeText(context, toast, Toast.LENGTH_SHORT).show();
    }

    @SuppressWarnings( "deprecation" )
    private void share(){
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET);
        // Use Amazon Appstore link on Fire TV / Amazon devices, Google Play otherwise
        String storeUrl = "https://www.amazon.com/gp/mas/dl/android?p=" + activity.getApplication().getPackageName();
        try {
            // Check if Google Play is available
            activity.getPackageManager().getPackageInfo("com.android.vending", 0);
            storeUrl = "https://play.google.com/store/apps/details?id=" + activity.getApplication().getPackageName();
        } catch (android.content.pm.PackageManager.NameNotFoundException ignored) { }
        shareIntent.putExtra(Intent.EXTRA_TEXT,
                activity.getResources().getString(R.string.app_name)+"\n" +
                        activity.getResources().getString(R.string.share_description) + "\n" + storeUrl
        );
        activity.startActivity(Intent.createChooser(shareIntent,"Share..."));
    }

    private void rate(){
        String packageName = activity.getApplication().getPackageName();
        // Try market:// URI first (works on Google Play devices)
        Uri uri = Uri.parse("market://details?id=" + packageName);
        Intent goToMarket = new Intent(Intent.ACTION_VIEW, uri);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            goToMarket.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY |
                    Intent.FLAG_ACTIVITY_NEW_DOCUMENT |
                    Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
        }
        try {
            activity.startActivity(goToMarket);
        } catch (ActivityNotFoundException e) {
            // market:// not available (Fire TV, BMW Screen, etc.) — open Amazon Appstore
            try {
                activity.startActivity(new Intent(Intent.ACTION_VIEW,
                        Uri.parse("https://www.amazon.com/gp/mas/dl/android?p=" + packageName)));
            } catch (Exception ex) {
                Log.d("Jacob", "Rate: no store available");
            }
        }
    }

    private void more_games(){
        String packageName = activity.getApplication().getPackageName();
        // Determine which store URL to use
        String storeUrl;
        try {
            activity.getPackageManager().getPackageInfo("com.android.vending", 0);
            storeUrl = "https://play.google.com/store/apps/details?id=" + packageName;
        } catch (android.content.pm.PackageManager.NameNotFoundException e) {
            // Google Play not available — use Amazon Appstore
            storeUrl = "https://www.amazon.com/gp/mas/dl/android?p=" + packageName;
        }
        try {
            activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(storeUrl)));
        } catch (Exception e) {
            Log.d("Jacob", "More Games Exception");
        }
    }

    private void show_review(){
        /*Log.d("review", ">>> show_review");
        //this.rev_manager = ReviewManagerFactory.create(activity);
        this.rev_manager = new FakeReviewManager(activity);
        Task<ReviewInfo> request = rev_manager.requestReviewFlow();
        request.addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                Log.d("review", ">>> show_review success");
                // We can get the ReviewInfo object
                ReviewInfo reviewInfo = task.getResult();

                Task<Void> flow = rev_manager.launchReviewFlow(activity, reviewInfo);
                flow.addOnCompleteListener(task2 -> {
                    Log.d("review", ">>> show_review task complete");
                    // The flow has finished. The API does not indicate whether the user
                    // reviewed or not, or even whether the review dialog was shown. Thus, no
                    // matter the result, we continue our app flow.
                });
            } else {
                // There was some problem, log or handle the error code.
                Log.d("Gradle review", "There was a problem ....");
            }
        });

         */
    }

    private void exit_game(){
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d("Jacob_mlk", "Confirmation Exit the game <<<");
                activity.onBackPressed();
            }
        });
    }

    public void splash(Boolean visible){
       LinearLayout main = activity.findViewById(R.id.main);

        if(splashTimer!=null){
            splashTimer.cancel();
            splashTimer = null;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if(visible) {
                    main.setVisibility(View.GONE);

                    long delay = activity.getResources().getInteger(R.integer.splash_delay);
                    splashTimer = new CountDownTimer(delay, 1000) {
                        public void onTick(long millisUntilFinished) { }

                        public void onFinish() {
                            main.setVisibility(View.VISIBLE);
                            if (activity.mwebView != null) {
                                activity.mwebView.requestFocus();
                            }
                        }
                    }.start();
                }
                else{
                    main.setVisibility(View.VISIBLE);
                    if (activity.mwebView != null) {
                        activity.mwebView.requestFocus();
                    }
                }
            }
        });
    }

    public void go_back(){
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d("Jacob_mlk", "Go to the main menu ... <<<");
                activity.onBackPressed();
            }
        });
    }
}
