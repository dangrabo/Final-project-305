// Function to validate the form on the back end
export function validateForm(data) {
    
    // Store the errors within this array
    const errors = [];

    // Validate the title
    if (!data.title || data.title.trim() === "") {
        errors.push("Title is required");
    }

    // Validate the due date
    if (!data.dateDue) {
        errors.push("Due date is required");
    }

    // Validate the priority
    let validOptions = ["Low", "Medium", "High"];
    if (!validOptions.includes(data.priority)) {
        errors.push("Don't change the priority!")
    }

    // Return the errors
    return {
        isValid: errors.length === 0,
        errors
    }
}