export const updateProfile = async (user) => {
    try {
      const response = await fetch(`http://localhost:3000/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }
  
      return await response.json(); // Return response data if needed
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };
  