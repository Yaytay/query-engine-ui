/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


/** WithRequired type helpers */
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export interface paths {
  "/api/docs": {
    /** @description Return a list of available  documents */
    get: operations["getAvailable"];
  };
  "/api/docs/{path}": {
    /** @description Return some documentation */
    get: operations["getDoc"];
  };
  "/api/info/available": {
    /** @description Return a list of available pipelines */
    get: operations["getAvailable_1"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    DocDir: WithRequired<components["schemas"]["DocNode"] & {
      children?: (components["schemas"]["DocNode"])[];
    }, "children" | "name" | "path">;
    DocFile: WithRequired<components["schemas"]["DocNode"] & {
      title?: string;
    }, "name" | "path" | "title">;
    DocNode: {
      name: string;
      children?: (components["schemas"]["DocNode"])[];
      path: string;
    };
    /**
     * @description <P>
     * An Argument represents a named piece of data that will be passed in to a pipepline.
     * </P>
     * <P>
     * Typically these correspond to query string arguments.
     * </P>
     * <P>
     * Every argument that a pipeline expects <em>should</em> be specified.
     * </P>
     */
    Argument: {
      /**
       * @description <P>The data type of an Argument.</P>
       * <P>All arguments will be received as Strings and will be parsed to the relavant type.</P>
       *  
       * @enum {string}
       */
      type: "String" | "Integer" | "Long" | "Double" | "Date" | "Time" | "DateTime";
      /**
       * @description <P>The name of the argument.</P>
       * <P>No two arguments in a single pipeline should have the same name.</P>
       * <P>
       * The name must consist entirely of Unicode alpha-numeric characters, it is
       * recommended that the name use only ASCII characters to avoid needing to encode it
       * but this is not a requirement.
       * </P>
       */
      name: string;
      /**
       * @description <P>The title to be displayed for the argument in any UI.</P>
       * <P>
       * The title serves no purpose in the processing of the pipeline.
       * If the title is not set the UI will display the name.
       * </P>
       */
      title?: string;
      /**
       * @description <P>The prompt to be displayed for the argument in any UI.</P>
       * <P>
       * The prompt serves no purpose in the processing of the pipeline.
       * </P>
       * <P>
       * The prompt should be kept short (a single word or phrase) so as to fit in the Input field on the UI parameter form.
       * </P>
       */
      prompt?: string;
      /**
       * @description <P>The description to be displayed for the argument in any UI.</P>
       * <P>
       * The description serves no purpose in the processing of the pipeline.
       * </P>
       * <P>
       * The description should be kept short (one short sentence) so as to fit above the Input field on the UI parameter form.
       * </P>
       */
      description?: string;
      /**
       * @description <P>If set to false the pipeline will fail if the argument is not supplied.</P>
       * <P>
       * Declaring mandatory arguments to not be optional results in a better user experience when
       * the users fail to provide it.
       * </P>
       *  
       * @default false
       */
      optional?: boolean;
      /**
       * @description <P>If set to true the argument may be provided multiple times.</P>
       * <P>
       * Multivalued arguments will be arrays when the Source sees them, for SQL they should usually be used
       * with an "IN" clause.
       * </P>
       * <P>
       * If an argument that is not multi-valued is provided multiple times the Query Engine will fail to run the Pipeline.
       * </P>
       *  
       * @default false
       */
      multiValued?: boolean;
      /**
       * @description <P>If set to true the argument will be ignored by the pipeline and may be excluded from those sent in.</P>
       * <P>
       * Ignored arguments are intended to be used by the UI for derivative arguments and should not be used by the processing of the pipeline.
       * </P>
       * <P>
       * If an argument that should be ignored is provided the Query Engine will fail to run the Pipeline.
       * </P>
       *  
       * @default false
       */
      ignored?: boolean;
      /**
       * @description <P>
       * A list of the name(s) of another argument(s) that this argument requires.
       * </P>
       * <P>
       * This is intended to allow the UI to disable inputs until their dependent argument has been provided.
       * </P>
       * <P>
       * This serves no purpose in the processing of the pipeline (it is explicitly not validated at runtime).
       * </P>
       */
      dependsUpon?: (string)[];
      /**
       * @description <P>The default value for the argument, as a string.</P>
       * <P>
       * The default value will be converted to the correct data type as it would be if it were received
       * as the argument.
       * Note that the default value should <em>not</em> be URL encoded.
       * </P>
       * <P>
       * The default value can only be used if the argument is optional.
       * </P>
       */
      defaultValue?: string;
      /**
       * @description <P>The minimum value for the argument, as a string.</P>
       * <P>
       * The minimum value will be converted to the correct data type as it would be if it were received
       * as the argument.
       * Note that the minimum value should <em>not</em> be URL encoded.
       * </P>
       * <P>
       * If an argument is provided that is less than the minimum value (using an appropriate comparison for the
       * datatype, not a string comparison) then it will be refused.
       * </P>
       */
      minimumValue?: string;
      /**
       * @description <P>The maximum value for the argument, as a string.</P>
       * <P>
       * The maximum value will be converted to the correct data type as it would be if it were received
       * as the argument.
       * Note that the maximum value should <em>not</em> be URL encoded.
       * </P>
       * <P>
       * If an argument is provided that is greater than the mimum value (using an appropriate comparison for the
       * datatype, not a string comparison) then it will be refused.
       * </P>
       */
      maximumValue?: string;
      possibleValues?: (components["schemas"]["ArgumentValue"])[];
      /**
       * @description <P>A URL that will provide a list of possible values that the argument may have.</P>
       * <P>
       * The URL should be called using the same credentials as the Pipeline was (it is expected, but not required, that the URL will be another Pipeline).
       * </P><P>
       * If the URL is just a path the UI will appended it to the base URL that was used to access the query engine.
       * </P>
       * <P>
       * It is possible to reference other argument values in the query string of the URL.
       * If the query string contains a structure like [&name=:arg] (specifically is contains a match of the regular expression ) then the entire
       * block will be repeated for each value that the argument 'arg' has at the time of the call.
       * If the query string contains the simpler structure &name=:arg (without the brackets) then just the :arg value will be replaced.
       * </P>
       * <P>
       * The URL should return a JSON list that may contain either:
       * <ul>
       * <li>Strings.
       * <li>Objects containing a &quot;value&quot; field.
       * <li>Objects containing a &quot;value&quot; field and a &quot;label&quot; field.
       * </ul>
       * 
       * The PossibleValuesUrl overrides the PossibleValues, a UI may choose to display the PossibleValues whilst the request to the PossibleValuesUrl is in flight, but the
       * end result should be the values returned by the PossibleValuesUrl.
       * <P>
       * The possible values are not validated, if an invalid value is provided the pipeline will still
       * attempt to run with it.
       * </P>
       */
      possibleValuesUrl?: string;
      /**
       * @description <P>A regular expression that all values of the argument must match.</P>
       * <P>
       * All values passed in are validated and the Query Engine will fail to run if the values does not match the reguarl expression.
       * </P>
       * <P>
       * At runtime expression will be treated as a standard Java regular expression, but well written UI should also validate
       * values against the expression so Interactive Pipelines should only use expressions that are compatible with JavaScrtip.
       */
      permittedValuesRegex?: string;
    };
    /**
     * @description <P>An ArgumentValue represents a possible value for an Argument to a Pipeline.</P>
     * <P>
     * ArgumentValues are not validated by the Query Engine at all, they exist solely to make life nicer for UIs.
     * The &quot;value&quot; in an ArgumentValue is the value that is to be passed in, the &quot;label&quot; field is purely for a UI to display.
     * It is expected that a UI will display the &quot;value&quot; if the &quot;label&quot; field is null or blank.
     */
    ArgumentValue: {
      /**
       * @description <P>
       * The value that is the actual potential argument that the Pipeline expects to receive.
       * </P>
       * <P>
       * The value is considered required, the label field is not.
       * </P>
       */
      value: string;
      /**
       * @description <P>
       * The label that should be shown to the user for the given value.
       * </P>
       * <P>
       * This label  is nullable, in which case the value should be displayed to the user.
       * </P>
       */
      label?: string;
    };
    /**
     * @description <P>The configuration for the final WriteStream of a pipeline.</P>
     * <P>
     * Typically the final WriteStream is the HttpResponse.
     * </P>
     * <P>
     * The format to use for a pipeline is chosen by according to the following rules:
     * <ol>
     * 
     * <li><pre>_fmt</pre> query string.<br>
     * If the HTTP request includes a <pre>_fmt</pre> query string argument each Format specified in the Pipeline will be checked (in order)
     * for a matching response from the {@link uk.co.spudsoft.query.defn.Format#getName()} method.
     * The first matching Format will be returned.
     * If no matching Format is found an error will be returned.
     * 
     * <li>Path extension.<br>
     * If the path in the HTTP request includes a '.' (U+002E, Unicode FULL STOP) after the last '/' (U+002F, Unicode SOLIDUS) character everything following that
     * character will be considered to be the extension, furthermore the extension (and full stop character) will be removed from the filename being sought.
     * If an extension is found each Format specified in the Pipeline will be checked (in order)
     * for a matching response from the {@link uk.co.spudsoft.query.defn.Format#getExtension()} method.
     * The first matching Format will be returned.
     * If no matching Format is found an error will be returned.
     * 
     * <li>Accept header.<br>
     * If the HTTP request includes an 'Accept' header each Format specified in the Pipeline will be checked (in order)
     * for a matching response from the {@link uk.co.spudsoft.query.defn.Format#getMediaType() ()} method.
     * Note that most web browsers include "*\/*" in their default Accept headers, which will match any Format that specifies a MediaType.
     * The first matching Format will be returned.
     * If no matching Format is found an error will be returned.
     * 
     * <li>Default<br>
     * If the request does not use any of these mechanisms then the first Format specified in the Pipeline will be used.
     * </ol>
     * <p>
     */
    Format: {
      /**
       * @description <P>The name of the format.</P>
       * <P>
       * The name is used to determine the format based upon the '_fmt' query string argument.
       * </P>
       * <P>
       * It is an error for two Formats to have the same name.
       * This is different from the other Format determinators which can be repeated, the name is the
       * ultimate arbiter and must be unique.
       * This ensures that all configured Formats can be used.
       * </P>
       */
      name?: string;
      /**
       * @description <P>The type of Format being configured.<P>
       *  
       * @enum {string}
       */
      type: "JSON" | "XLSX" | "Delimited" | "HTML";
      /**
       * @description <P>The extension of the format.</P>
       * <P>
       * The extension is only used to determine the format based upon the URL path.
       * If multiple formats have the same extension the first in the list will be used.
       * </P>
       */
      extension?: string;
      /**
       * @description <P>The media type of the format.</P>
       * <P>
       * The media type is used to determine the format based upon the Accept header in the request.
       * If multiple formats have the same media type the first in the list will be used.
       * </P>
       * <P>
       * The media type will also be set as the Content-Type header in the response.
       * </P>
       */
      mediaType?: string;
    };
    FormatDelimited: WithRequired<{
      type: "Delimited";
    } & Omit<components["schemas"]["Format"], "type"> & {
      /** @default csv */
      name?: string;
      /** @default csv */
      extension?: string;
      /** @default text/csv */
      mediaType?: string;
      /** @default , */
      delimiter?: string;
      /** @default " */
      openQuote?: string;
      /** @default " */
      closeQuote?: string;
      newline?: string;
    }, "type">;
    /**
     * @description <P>The definition of an HTML output format.</P>
     * <P>
     * The HTML output format produces an HTML snippet containing a table.
     * The output itself has no formatting, but a number of CSS classes are applied to the elements enabling the UI to format them as they wish.
     * </P>
     * <P>
     * The CSS classes are:
     * <UL>
     * <LI>header</BR>
     * The header row.
     * <LI>dataRow</BR>
     * A row of data (other than the header row).
     * <LI>evenRow</BR>
     * An even numbered data row (the first dataRow is row 0, which is even).
     * <LI>oddRow</BR>
     * An odd numbered data row (the first dataRow is row 0, which is even).
     * <LI>evenCol</BR>
     * An even numbered column (header or dataRow, the first column is 0, which is even).
     * <LI>oddRow</BR>
     * An odd numbered column (header or dataRow, the first column is 0, which is even).
     * </UL>
     * </P>
     */
    FormatHtml: WithRequired<{
      type: "HTML";
    } & Omit<components["schemas"]["Format"], "type"> & {
      /** @default html */
      name?: string;
      /** @default html */
      extension?: string;
      /** @default text/html */
      mediaType?: string;
    }, "type">;
    FormatJson: WithRequired<{
      type: "JSON";
    } & Omit<components["schemas"]["Format"], "type"> & {
      /** @default json */
      name?: string;
      /** @default json */
      extension?: string;
      /** @default application/json */
      mediaType?: string;
    }, "type">;
    FormatXlsx: WithRequired<{
      type: "XLSX";
    } & Omit<components["schemas"]["Format"], "type"> & ({
      /** @default xlsx */
      name?: string;
      /** @default xlsx */
      extension?: string;
      /** @default application/vnd.openxmlformats-officedocument.spreadsheetml.sheet */
      mediaType?: string;
      /**
       * @description <P>The name of the sheet that will contain the data in the Excel Workbook.</P>
       *  
       * @default data
       */
      sheetName?: string;
      /**
       * @description <P>The name of the creator of the data, as it will appear in the properties of the Excel Workbook file.</P>
       * <P>
       * If no value is provided the system will attempt to extract the username from the access token used in the request.
       * If there is not value in the access token the value &quot;Unknown&quot; will be used.
       * </P>
       */
      creator?: string;
      /**
       * @description <P>Whether or not grid lines should be shown on the Excel Worksheet.</P>
       * <P>
       * If the value is true all cells in the output will have a thin black border.
       * This includes cells with a null value, but excludes cells outside the range of the data.
       * </P>
       *  
       * @default true
       */
      gridLines?: boolean;
      /**
       * @description <P>Whether or not a header row should be included on the Excel Worksheet.</P>
       * <P>
       * If the value is true the first row on the Worksheet will contain the field names (or the overriding names from the columns defined here).
       * </P>
       *  
       * @default true
       */
      headers?: boolean;
      headerFont?: components["schemas"]["FormatXlsxFont"];
      bodyFont?: components["schemas"]["FormatXlsxFont"];
      headerColours?: components["schemas"]["FormatXlsxColours"];
      evenColours?: components["schemas"]["FormatXlsxColours"];
      oddColours?: components["schemas"]["FormatXlsxColours"];
      /**
       * @description <P>The overrides for the formatting of specific columns.</P>
       * <P>
       * Usually the default formatting of a column is adequate, but this can be overridden if there is a specific need.
       * </P>
       * <P>
       * There are only three aspects of a column that can be overridden:
       * <UL>
       * <LI>The title that will appear in the header row.
       * <LI>The format that Excel will apply to the body cells.
       * <LI>The width of the column.
       * </UL>
       * </P>
       * <P>
       * There is no capability for changing the order of output columns, this will always be set as the order they appear in the data.
       * </P>
       * <P>
       * The key in this map is the name of the field as it appears in the data rows as they reach the outputter.
       * </P>
       */
      columns?: {
        empty?: boolean;
        [key: string]: components["schemas"]["FormatXlsxColumn"] | undefined;
      };
    }), "type">;
    /**
     * @description <P>The foreground and background colours to use for odd numbered body rows.</P>
     * <P>
     * Odd rows are defined to be those where the row number is odd.
     * This means that if there is a header row the first data row is even, but if there is no header row then the first data row is odd.
     * </P>
     * <P>
     * There is no default value in the format, but if not specified the output will have black text on white background.
     * </P>
     */
    FormatXlsxColours: {
      /**
       * @description <P>The foreground colour to use.</P>
       * <P>
       * Colours must be expressed as 6 or 8 uppercase hexadecimal digits.
       * </P>
       * <P>
       * Some examples:
       * <UL>
       * <LI><font style="color: #FFFFFF">FFFFFF</font>
       * <LI><font style="color: #999999">999999</font>
       * <LI><font style="color: #990000">990000</font>
       * <LI><font style="color: #000099">000099</font>
       * <LI><font style="color: #0A5F42">0A5F42</font>
       * </UL>
       * </P>
       *  
       * @default 000000
       */
      fgColour?: string;
      /**
       * @description <P>The background colour to use.</P>
       * <P>
       * Colours must be expressed as 6 or 8 uppercase hexadecimal digits.
       * </P>
       * <P>
       * Some examples:
       * <UL>
       * <LI><font style="background-color: #000000">000000</font>
       * <LI><font style="background-color: #999999">999999</font>
       * <LI><font style="background-color: #990000">990000</font>
       * <LI><font style="background-color: #000099">000099</font>
       * <LI><font style="background-color: #0A5F42">0A5F42</font>
       * </UL>
       * </P>
       *  
       * @default FFFFFF
       */
      bgColour?: string;
    };
    /**
     * @description <P>The overrides for the formatting of specific columns.</P>
     * <P>
     * Usually the default formatting of a column is adequate, but this can be overridden if there is a specific need.
     * </P>
     * <P>
     * There are only three aspects of a column that can be overridden:
     * <UL>
     * <LI>The title that will appear in the header row.
     * <LI>The format that Excel will apply to the body cells.
     * <LI>The width of the column.
     * </UL>
     * </P>
     * <P>
     * There is no capability for changing the order of output columns, this will always be set as the order they appear in the data.
     * </P>
     * <P>
     * The key in this map is the name of the field as it appears in the data rows as they reach the outputter.
     * </P>
     */
    FormatXlsxColumn: {
      /** @description <P>The title to put in the header row instead of the field name.</P> */
      header?: string;
      /**
       * @description <P>The Excel format to apply to body cells instead of the default.</P>
       * <P>
       * This is an Excel format as would be entered in the Format Cells -> Number -> Custom box.
       * </P>
       */
      format?: string;
      /**
       * Format: double 
       * @description <P>The width of the column in Excel column width units.</P>
       * <P>
       * One unit of column width is equal to the width of one character in the Normal style. For proportional fonts, the width of the character 0 (zero) is used.
       * </P>
       */
      width?: number;
    };
    /**
     * @description <P>The font to use for the body rows (all rows after the header row).</P>
     * <P>
     * There is no default value in the format, but if not specified the font used will be Calibri, 11pt.
     * </P>
     */
    FormatXlsxFont: {
      /** @description <P>The name of the font.</P> */
      fontName?: string;
      /**
       * Format: int32 
       * @description <P>The size of the font.</P>
       * <P>
       * Font size is measured in points (approximately 1/72 of an inch).
       * </P>
       */
      fontSize?: number;
    };
    ImmutableListArgument: (components["schemas"]["Argument"])[];
    ImmutableListFormat: (components["schemas"]["Format"])[];
    /**
     * @description <P>The overrides for the formatting of specific columns.</P>
     * <P>
     * Usually the default formatting of a column is adequate, but this can be overridden if there is a specific need.
     * </P>
     * <P>
     * There are only three aspects of a column that can be overridden:
     * <UL>
     * <LI>The title that will appear in the header row.
     * <LI>The format that Excel will apply to the body cells.
     * <LI>The width of the column.
     * </UL>
     * </P>
     * <P>
     * There is no capability for changing the order of output columns, this will always be set as the order they appear in the data.
     * </P>
     * <P>
     * The key in this map is the name of the field as it appears in the data rows as they reach the outputter.
     * </P>
     */
    ImmutableMapStringFormatXlsxColumn: {
      empty?: boolean;
      [key: string]: components["schemas"]["FormatXlsxColumn"] | undefined;
    };
    PipelineDir: WithRequired<components["schemas"]["PipelineNode"] & {
      children?: (components["schemas"]["PipelineNode"])[];
    }, "children" | "name" | "path">;
    PipelineFile: WithRequired<components["schemas"]["PipelineNode"] & {
      title?: string;
      description?: string;
      arguments?: (components["schemas"]["Argument"])[];
      destinations?: (components["schemas"]["Format"])[];
    }, "name" | "path">;
    PipelineNode: {
      name: string;
      children?: (components["schemas"]["PipelineNode"])[];
      path: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export interface operations {

  /** @description Return a list of available  documents */
  getAvailable: {
    responses: {
      /** @description The list of available documents. */
      200: {
        content: {
          "application/json": (components["schemas"]["DocNode"])[];
        };
      };
    };
  };
  /** @description Return some documentation */
  getDoc: {
    parameters: {
      path: {
        path: string;
      };
    };
    responses: {
      /** @description A documnent about Query Engine. */
      200: {
        content: {
          "text/markdown": unknown;
        };
      };
    };
  };
  /** @description Return a list of available pipelines */
  getAvailable_1: {
    responses: {
      /** @description The list of available pipelines. */
      200: {
        content: {
          "application/json": (components["schemas"]["PipelineNode"])[];
        };
      };
    };
  };
}