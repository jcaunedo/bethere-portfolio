import * as React from "react";

/**
 * Reports a step's answers to its flow whenever they change (and once on mount, so the flow also
 * holds the defaults it never touched). Steps keep their own state, seeded from `defaultAnswers`;
 * this is how the flow learns what was chosen — for the Review summary, and to restore the step
 * when it's revisited. The latest callback is used without re-firing when only its identity changes.
 * Layout-internal helper, not part of the package API.
 */
function useReportAnswers<T>(answers: T, onAnswersChange: ((answers: T) => void) | undefined) {
	const callback = React.useRef(onAnswersChange);
	callback.current = onAnswersChange;

	React.useEffect(() => {
		callback.current?.(answers);
	}, [answers]);
}

export { useReportAnswers };
