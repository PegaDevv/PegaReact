import { axios, getError, ReferenceHelper } from "../_helpers";
import { endpoints } from "./endpoints";

/**
 * Functions used to issue AJAX requests and manage responses.
 * All of the included methods use the Axios library for Promise-based requests.
 */
export const caseService = {
  getCaseTypes,
  getCaseCreationPage,
  createCase,
  getCase,
  updateCase,
  refreshCase,
  getPage,
  getView,
  cases
};

function getCaseTypes() {
  return axios
    .get(endpoints.BASEURL + endpoints.CASETYPES)
    .then(function(response) {
      return response.data.caseTypes;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function getCaseCreationPage(id) {
  return axios
    .get(endpoints.BASEURL + endpoints.CASETYPES + "/" + id)
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function createCase(id, processID, content) {
  return axios
    .post(
      endpoints.BASEURL + endpoints.CASES,
      processID ?
        {
          caseTypeID: id,
          processID: processID,
          content: content
        }
      :
        {
          caseTypeID: id,
          content: content
        })
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(error);
    });
}

function getCase(id) {
  return axios
    .get(encodeURI(endpoints.BASEURL + endpoints.CASES + "/" + id), {
      headers: {
        "Access-Control-Expose-Headers": "etag"
      }
    })
    .then(function(response) {
      response.data["etag"] = response.headers.etag;
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function updateCase(id, body, etag, action, pageInstr) {
  let actionParam = action ? { actionID: action } : null;
  
  return axios
    .put(
      encodeURI(endpoints.BASEURL + endpoints.CASES + "/" + id),
      pageInstr && pageInstr.pageInstructions ?
        {
          content: ReferenceHelper.getPostContent(body, pageInstr.postSettings),
          pageInstructions: pageInstr.pageInstructions
        } :
        {
          content: ReferenceHelper.getPostContent(body)
        },
      {
        params: actionParam,
        headers: {
          "If-Match": etag
        }
      }
    )
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function refreshCase(myCase, body) {
  return axios
    .put(
      encodeURI(
        endpoints.BASEURL +
          endpoints.CASES +
          "/" +
          myCase.ID +
          endpoints.REFRESH
      ),
      {
        content: body
      },
      {
        headers: {
          "Access-Control-Expose-Headers": myCase.etag
        }
      }
    )
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function getPage(caseID, pageID) {
  return axios
    .get(
      encodeURI(
        endpoints.BASEURL +
          endpoints.CASES +
          "/" +
          caseID +
          endpoints.PAGES +
          "/" +
          pageID
      ) )
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function getView(caseID, viewID) {
  return axios
    .get(
      encodeURI(
        endpoints.BASEURL +
          endpoints.CASES +
          "/" +
          caseID +
          endpoints.VIEWS +
          "/" +
          viewID
      ) )
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}

function cases() {
  return axios
    .get(endpoints.BASEURL + endpoints.CASES)
    .then(function(response) {
      return response.data.cases;
    })
    .catch(function(error) {
      return Promise.reject(getError(error));
    });
}
