// react-markdown markdown is not compatible with jest, so mock it
function ReactMarkdown({ children }){
  return <>{children}</>;
}

export default ReactMarkdown;