"use server";

export async function submitLeadToCRM(formData: FormData) {
  try {
    const data = {
      lastname: formData.get("name"),
      phone: formData.get("phone"),
      class: formData.get("class"),
      locality: formData.get("locality"),
      subjects: formData.get("subjects"),
      requirements: formData.get("requirements"),
    };

    const response = await fetch("https://crm.swatihometuition.in/create_lead_api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to submit to CRM");
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return { success: false, error: "Failed to submit request" };
  }
}
