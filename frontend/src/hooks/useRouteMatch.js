/**
 * @file useRouteMatch.js
 * @description Custom hook for matching current route against a path pattern
 * @module hooks/useRouteMatch
 * 
 * Wraps React Router's matchPath utility with useLocation hook for
 * convenient route matching in components. Returns match object if
 * current pathname matches the provided path pattern, null otherwise.
 */

import { useLocation, matchPath } from "react-router-dom";

export default function useRouteMatch(path) {
  const location = useLocation();
  return matchPath(location.pathname, { path });
}
