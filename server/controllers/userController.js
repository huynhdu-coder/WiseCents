import User from "../models/User.js";

export const getProfile = async (req, res) => {
  const user = req.user;
  res.json({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    dob: user.dob,
    is_admin: user.is_admin,
    primary_intent: user.primary_intent,
    advice_style: user.advice_style,
    change_tolerance: user.change_tolerance,
    ai_data_consent: user.ai_data_consent,
  });
};

export const updatePreferences = async (req, res) => {
  try {
    const userId = req.userId;
    const { primary_intent, advice_style, change_tolerance } = req.body;

    const updatedUser = await User.updatePreferences(userId, {
      primary_intent,
      advice_style,
      change_tolerance,
    });

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Preferences updated successfully",
      preferences: {
        primary_intent: updatedUser.primary_intent,
        advice_style: updatedUser.advice_style,
        change_tolerance: updatedUser.change_tolerance,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Update AI data consent
export const updateConsent = async (req, res) => {
  try {
    const userId = req.userId;
    const { ai_data_consent } = req.body;

    if (!["opt-in", "opt-out"].includes(ai_data_consent)) {
      return res.status(400).json({ message: "Invalid consent value" });
    }

    const updatedUser = await User.updateConsent(userId, ai_data_consent);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Consent updated successfully",
      ai_data_consent: updatedUser.ai_data_consent,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};