// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: graduation-cap;

// Attendance Widget for Scriptable
// Created on March 23, 2025

// Import configuration
const config = importModule("./config");

function calculateMargin(present, total) {
  const pMin = 75;
  const currentPercentage = (present / total) * 100;

  if (currentPercentage >= pMin) {
    return Math.floor((present - 0.75 * total) / 0.75);
  }

  const requiredClasses = Math.ceil(
    (pMin * total - 100 * present) / (100 - pMin)
  );
  return -requiredClasses;
}

let widget = new ListWidget();
widget.backgroundColor = new Color("#1E1E1E");
widget.setPadding(16, 16, 16, 16);
widget.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000); // Refresh after 1 hour

async function fetchAttendance() {
  try {
    const request = new Request(`${config.baseUrl}/attendance`);
    request.headers = config.headers;
    return await request.loadJSON();
  } catch (error) {
    console.error(`Error fetching attendance data: ${error}`);
    return null;
  }
}

async function createWidget() {
  try {
    const data = await fetchAttendance();

    if (!data || !data.attendance) {
      const errorText = widget.addText("Could not fetch attendance data");
      errorText.font = Font.mediumSystemFont(12);
      errorText.textColor = Color.red();
      return widget;
    }

    const titleText = widget.addText(`Attendance`);
    titleText.font = Font.boldSystemFont(14);
    titleText.textColor = new Color("#FFFFFF");
    widget.addSpacer(8);

    const sortedAttendance = [...data.attendance]
      .filter((course) => course)
      .sort(
        (a, b) =>
          parseFloat(a.attendancePercentage) -
          parseFloat(b.attendancePercentage)
      );

    for (const course of sortedAttendance) {
      const attendance = parseFloat(course.attendancePercentage);
      const courseStack = widget.addStack();
      courseStack.layoutHorizontally();
      courseStack.spacing = 6;

      const indicator = courseStack.addStack();
      indicator.size = new Size(10, 10);
      indicator.cornerRadius = 5;

      if (attendance < 75) {
        indicator.backgroundColor = new Color("#FF3B30"); // Red for danger
      } else if (attendance < 85) {
        indicator.backgroundColor = new Color("#FFCC00"); // Yellow for warning
      } else {
        indicator.backgroundColor = new Color("#34C759"); // Green for good
      }

      const courseInfo = courseStack.addStack();
      courseInfo.layoutVertically();

      const courseName = courseInfo.addText(
        `${course.courseTitle} ${course.category === "Practical" ? "Lab" : ""}`
      );
      courseName.font = Font.mediumSystemFont(12);
      courseName.textColor = new Color("#FFFFFF");

      const present = course.hoursConducted - course.hoursAbsent;
      const margin = calculateMargin(present, course.hoursConducted);
      const marginText =
        margin >= 0 ? `Margin: ${margin}` : `Required ${Math.abs(margin)} `;

      const attendanceText = courseInfo.addText(
        `${course.attendancePercentage}% (${course.hoursAbsent}/${course.hoursConducted}) : ${marginText}`
      );
      attendanceText.font = Font.systemFont(10);
      attendanceText.textColor = new Color("#AAAAAA");

      widget.addSpacer(6);
    }

    // Add updated time
    widget.addSpacer(4);
    const updateText = widget.addText(
      `Updated: ${new Date().toLocaleTimeString()}`
    );
    updateText.font = Font.systemFont(8);
    updateText.textColor = new Color("#666666");
    updateText.rightAlignText();
  } catch (error) {
    console.error(`Error creating widget: ${error}`);
    const errorText = widget.addText(`Error: ${error.message}`);
    errorText.font = Font.mediumSystemFont(12);
    errorText.textColor = Color.red();
  }

  return widget;
}

const widgetToDisplay = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widgetToDisplay);
} else {
  widgetToDisplay.presentMedium();
}

Script.complete();
