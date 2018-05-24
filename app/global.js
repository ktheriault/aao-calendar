export const EVENT_ID = "213800ffda91408c9266c28b954e95f6";

export const SCHEDULE_VIEWS = {
    FOR_DOCTORS: {
        key: "forDoctors",
        title: "For Doctors",
    },
    FOR_STAFF: {
        key:"forStaff",
        title: "For Staff"
    },
};

export const ABBR_MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const ABBR_DAYS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];

// CSS information for dynamic styling if the CSS class doesn't exist
import "./style/App.css";
let CSS_RULE_LIST = document.styleSheets[1].cssRules;
let CSS_CLASS_NAMES = [].slice.call(CSS_RULE_LIST).map(cssStyleRule => cssStyleRule.selectorText);
let CSS_CLASS_DICTIONARY = {};
CSS_CLASS_NAMES.forEach((className) => {
    CSS_CLASS_DICTIONARY[className] = true;
});
const ROOT_CSS_TEXT = CSS_RULE_LIST[0].style.cssText;
const HOUR_HEIGHT = parseInt(ROOT_CSS_TEXT.split(" ")[1]) || 96;
const TIMELINE_VERTICAL_OFFSET = (parseInt(ROOT_CSS_TEXT.split(" ")[11]) || 12) * (3/4);
export { CSS_CLASS_DICTIONARY, HOUR_HEIGHT, TIMELINE_VERTICAL_OFFSET };
