%global lib ds reqType;
%macro getData;
    proc json out=_webout pretty nosastags;
        write open object;
            write values "columns";
            write open array;
                export sashelp.vcolumn
                    (where =
                        (
                            (libname = upcase("&lib"))
                        and (memname = upcase("&ds"))
                        )
                    );
            write close;
            write values "rows";
            write open array;
                export &lib..&ds;
            write close;
        write close;
    run;
%mend;

%macro getLibraries;
    proc json out=_webout pretty nosastags;
        export sashelp.vslib;
    run;
%mend;

%macro getTables;
    proc json out=_webout pretty nosastags;
        export sashelp.vstable (where = ((libname = upcase("&lib"))));
    run;
%mend;

%macro execute;
    %if "&reqType" = "getlibraries" %then %getLibraries;
    %else %if "&reqType" = "gettables" %then %getTables;
    %else %getData;
%mend;

%execute;