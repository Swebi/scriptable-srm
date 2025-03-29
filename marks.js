// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: graduation-cap;

// Marks Widget for Scriptable
// Created on March 23, 2025

// Import configuration
const config = importModule("./config");

let widget = new ListWidget();
widget.backgroundColor = new Color("#1E1E1E");
widget.setPadding(12, 12, 12, 12);
widget.refreshAfterDate = new Date(Date.now() + 60 * 60 * 1000); // Refresh after 1 hour

async function fetchMarks() {
  try {
    const request = new Request(`${config.baseUrl}/marks`);
    request.headers = config.headers;
    return await request.loadJSON();
  } catch (error) {
    console.error(`Error fetching marks data: ${error}`);
    return null;
  }
}

function getGradeColor(percentage) {
  if (percentage >= 90) return new Color("#34C759"); // Green for O
  if (percentage >= 80) return new Color("#30B0C7"); // Blue for A+
  if (percentage >= 70) return new Color("#FFCC00"); // Yellow for A
  if (percentage >= 60) return new Color("#FF9500"); // Orange for B+
  return new Color("#FF3B30"); // Red for B
}

async function createWidget() {
  try {
    const data = await fetchMarks();

    if (!data || !data.marks) {
      const errorText = widget.addText("Could not fetch marks data");
      errorText.font = Font.mediumSystemFont(12);
      errorText.textColor = Color.red();
      return widget;
    }

    const titleText = widget.addText(`Marks`);
    titleText.font = Font.boldSystemFont(14);
    titleText.textColor = new Color("#FFFFFF");
    widget.addSpacer(8);

    const sortedMarks = [...data.marks]
      .filter((course) => course.courseType === "Theory")
      .sort((a, b) => {
        const aPercentage =
          (parseFloat(a.overall.scored) / parseFloat(a.overall.total)) * 100;
        const bPercentage =
          (parseFloat(b.overall.scored) / parseFloat(b.overall.total)) * 100;
        return aPercentage - bPercentage;
      });

    for (const course of sortedMarks) {
      const courseStack = widget.addStack();
      courseStack.layoutHorizontally();
      courseStack.spacing = 4;

      const indicator = courseStack.addStack();
      indicator.size = new Size(8, 8);
      indicator.cornerRadius = 4;

      const percentage =
        (parseFloat(course.overall.scored) / parseFloat(course.overall.total)) *
        100;
      indicator.backgroundColor = getGradeColor(percentage);

      const courseInfo = courseStack.addStack();
      courseInfo.layoutVertically();
      courseInfo.spacing = 2;

      const nameMarksStack = courseInfo.addStack();
      nameMarksStack.layoutHorizontally();
      nameMarksStack.spacing = 4;

      const courseName = nameMarksStack.addText(course.courseName);
      courseName.font = Font.mediumSystemFont(12);
      courseName.textColor = new Color("#FFFFFF");

      const marksText = nameMarksStack.addText(
        `${course.overall.scored}/${course.overall.total} (${percentage.toFixed(
          1
        )}%)`
      );
      marksText.font = Font.systemFont(10);
      marksText.textColor = new Color("#AAAAAA");

      if (course.testPerformance && course.testPerformance.length > 0) {
        const testStack = courseInfo.addStack();
        testStack.layoutHorizontally();
        testStack.spacing = 2;

        course.testPerformance.forEach((test, index) => {
          const testText = testStack.addText(
            `${test.test}: ${test.marks.scored}/${test.marks.total}`
          );
          testText.font = Font.systemFont(9);
          testText.textColor = new Color("#666666");

          testStack.addSpacer(4);
        });
      }

      widget.addSpacer(4);
    }

    widget.addSpacer(2);
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
