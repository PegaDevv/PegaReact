import React, { useState, useRef, useEffect, useCallback } from "react";
import { Form } from "formsy-semantic-ui-react";
import { Search } from "semantic-ui-react";
import _ from "lodash";

import { dataPageService } from "../_services";
import { sourceTypes } from "../_constants";
import { buildDPParams, buildDPQueryString } from "../_helpers";

/**
 * Get dropdown options from a clipboard page
 * @param { field }
 */

const getAutoCompleteOptions = (mode) => {
  if (!mode) return [];

  // If we are using a local list as source, set its value now
  if (
    mode.listSource === sourceTypes.LOCALLIST ||
    mode.listSource === sourceTypes.PAGELIST ||
    (mode.listSource === sourceTypes.DATAPAGE && mode.options != null)
  ) {
    if (mode && mode.listSource === sourceTypes.PAGELIST && !mode.options) {
      const pageId = mode.clipboardPageID;
      const clipboardPagePrompt = mode.clipboardPagePrompt;
      const clipboardPageValue = mode.clipboardPageValue;
      const clipboardPageTooltip = mode.clipboardPageTooltip;
      if (pageId && clipboardPagePrompt && clipboardPageValue) {
        const optionsPage = caseDetail.content[pageId];
        if (optionsPage && optionsPage.length > 0) {
          return optionsPage.map((item) => {
            return {
              title: item[clipboardPageValue],
              description:
                clipboardPagePrompt && item[clipboardPagePrompt]
                  ? item[clipboardPagePrompt]
                  : "",
              tooltip:
                clipboardPageTooltip && item[clipboardPageTooltip]
                  ? item[clipboardPageTooltip]
                  : "",
            };
          });
        }
      }
    } else if (
      mode &&
      (mode.listSource === sourceTypes.LOCALLIST ||
        (mode.listSource === sourceTypes.DATAPAGE && mode.options != null) ||
        (mode.listSource === sourceTypes.PAGELIST && mode.options != null))
    ) {
      // key is the primary displayed value and value is the prompt
      return mode.options.map((option) => {
        return {
          title: option.key,
          description: option.value ? option.value : "",
          tooltip: option.tooltip ? option.tooltip : "",
        };
      });
    }
  }

  return [];
};

/**
 * Standardized component to handle AutoCompletes sourced from data pages.
 */

export const PegaAutoComplete = (props) => {
  const {
    mode,
    caseDetail,
    reference,
    repeatlayouttype,
    tooltip,
    onChange,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState(props.value);
  const [source, setSource] = useState(getAutoCompleteOptions(mode));
  const [dataPageQuery, setDataPageQuery] = useState(""); // String representation of a last DP query with params

  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchDP(mode);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const params = buildDPParams(mode.dataPageParams);
    const newDataPageQuery = buildDPQueryString(mode.dataPageID, params);

    if (dataPageQuery != newDataPageQuery) {
      fetchDP(mode);
    }
  }, [mode]);

  useEffect(() => {
    if (value !== props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  const convertDataPageToSource = (dataPage) => {
    // dataPageValue is the primary displayed value (key) and dataPagePrompt is the (additional info) and dataPageTooltip is more addtl info

    // Value it the first advanced search entered entry (main result)
    const {
      dataPageValue: propKey,
      dataPagePrompt: propValue,
      dataPageTooltip: propTooltip,
    } = mode;

    // Is this important...how about for other entries?
    if (propKey.indexOf(".") === 0) {
      propKey = propKey.substring(1);
    }

    let source = [];
    dataPage.pxResults.forEach((result) => {
      if (result[propKey]) {
        const entry = {
          title: result[propKey],
          description: (propValue && result[propValue]) || "",
          tooltip: (propTooltip && result[propTooltip]) || "",
        };
        source.push(entry);
      }
    });

    return source;
  };

  const fetchDP = (mode) => {
    const params = buildDPParams(mode.dataPageParams);
    const newDataPageQuery = buildDPQueryString(mode.dataPageID, params);

    // In the event that the autocomplete is sourced from a DataPage:
    // Directly call dataPageService methods so we do not have actions overhead.
    // This should be very narrow use case, specific to component.
    if (mode.listSource === sourceTypes.DATAPAGE && mode.options == null) {
      dataPageService.getDataPage(mode.dataPageID, params).then(
        (dataPage) => {
          setSource(convertDataPageToSource(dataPage));
          setDataPageQuery(newDataPageQuery);
        },
        (error) => {
          setSource([{ key: error, text: error, value: error }]);
          setDataPageQuery(newDataPageQuery);
        }
      );
    } else {
      // Setting so we don't come back in here from componentDidUpdate
      setDataPageQuery(newDataPageQuery);
    }
  };

  /**
   * Disable the ENTER key so that it doesn't invoke a defined onClick handler for the submit button (or the first button).
   *  If you really want to have the ENTER key within input fields to lead to submit, unwire this handler
   */
  const disableEnter = (e) => {
    if (e.which === 13) {
      e.preventDefault();
    }
  };

  const handleResultSelect = (e, { result }) => {
    // This is needed because otherwise we get a warning that we are accessing preventDefault() on a released
    // instances of the synthetic object. Should only be needed for AutoComplete and for small # of cases.
    if (!e) return;
    if (e?.persist) e.persist();

    setValue(result.title);
    onChange(e, {
      value: result.title,
      reference: reference,
      repeatlayouttype: repeatlayouttype,
    });
  };

  const handleSearchChange = useCallback((e, { value }) => {
    clearTimeout(timeoutRef.current);
    setIsLoading(true);
    setValue(value);

    timeoutRef.current = setTimeout(() => {
      if (value.length === 0) {
        setIsLoading(false);
        setResults([]);
        setValue("");

        return;
      }

      const re = new RegExp(_.escapeRegExp(value), "i");
      const isMatch = (result) =>
        re.test(result.title) ||
        re.test(result.description) ||
        re.test(result.tooltip);

      const filtered = _.filter(source, isMatch).map((result, index) => ({...result, key:index}));

      setIsLoading(false);
      setResults(filtered);
    }, 300);
  }, []);

  const resultRenderer = ({ title, description, tooltip }) => (
    <div className="content">
      <span className="title">{title}</span>
      <span className="description results-padleft">{description}</span>
      <span className="description results-padleft">{tooltip}</span>
    </div>
  );

  return (
    <Form.Input
      fluid={true}
      type="search"
      required={props.required}
      disabled={props.disabled}
      label={props.label}
      name={props.name}
      value={value}
      reference={props.reference}
      repeatlayouttype={props.repeatlayouttype}
      errorLabel={props.errorLabel}
      validationError={props.validationError}
      error={props.error}
      data-test-id={props.testid}
      {...tooltip}
      className="pr-auto"
    >
      <Search
        fluid={true}
        placeholder={props.placeholder}
        loading={isLoading}
        onResultSelect={handleResultSelect}
        onSearchChange={handleSearchChange}
        onKeyPress={(e) => disableEnter(e)}
        results={results}
        resultRenderer={resultRenderer}
        value={value}
        {...tooltip}
      />
    </Form.Input>
  );
};
