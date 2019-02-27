Sub stockHard()

    Dim xRow As Double
    xRow = 2

    'Determine how many rows have data to use as last row in for-loops
    NumRows = Range("A1", Range("A1").End(xlDown)).Rows.Count
    
    'print stock column headers
    Cells(1, 10).Value = "Ticker"
    Cells(1, 11).Value = "Yearly Change"
    Cells(1, 12).Value = "Percent Change"
    Cells(1, 13).Value = "Total Stock Volume"

    'loop through first column to print stock tickers to new column
    For i = 2 To NumRows  'For loop that runs through all data in sheet
        If Cells(i, 1) <> Cells(i - 1, 1) Then 'Compares cell to cell immediatly before'
            Cells(xRow, 10).Value = Cells(i, 1).Value 'If ticker number changes, print ticker to column J
            xRow = xRow + 1 'Increment ticker counter row'
        End If
    Next i

    xRow = 2 'reset counter for next for-loop
    
    'Dimension and initalize variables used for calculations
    Dim stockVol As Double
    stockVol = 0

    Dim yearOpen As Double
    yearOpen = 0

    Dim yearClose As Double
    yearClose = 0
    
    Dim prctChng As Double
    prctChng = 0

    'loop through data to sum total values
    For j = 2 To NumRows
        If Cells(j, 1).Value <> Cells(j - 1, 1) Then 'Compare ticker to previous value'
            yearOpen = Cells(j, 3).Value 'If ticker changes, store year open value'
                If yearOpen = 0 Then 'determine if stock was open at begin of the year (has data)
                    For m = j To NumRows 'find first row where there is data'
                        yearOpen = Cells(m, 3).Value 'store data as year open value
                        If yearOpen <> 0 Then Exit For 'if stock HAS value in cell, exit loop
                    Next m
                End If
        End If

        If Cells(j, 1).Value = Cells(xRow, 10).Value Then 'Compare ticker in frist column to column J
            stockVol = stockVol + Cells(j, 7).Value 'Running count of stock volume'
            Cells(xRow, 13).Value = stockVol 'Print running count to column '
            yearClose = Cells(j, 6).Value 'Store year end variables
            Cells(xRow, 11).Value = (yearClose - yearOpen) 'calculate change of stock value and print to Cells
            prctChng = ((yearClose - yearOpen) / yearOpen) 'calculate percent change over year
            Cells(xRow, 12).Value = prctChng 'print percent change to year'
        Else
            xRow = xRow + 1 'increment row'
            stockVol = 0 'reset count of stock volume'
        End If
        
    Next j

    'call stock stat subroutine
    Call stockStats

    'call formatting subroutine
    Call Formatto

End Sub

Sub stockStats()

'Subroutine to calculate stats for stocks'

    'print stock column headers
    Cells(1, 16).Value = "Ticker"
    Cells(1, 17).Value = "Value"
    Cells(2, 15).Value = "Greatest % Increase"
    Cells(3, 15).Value = "Greatest % Decrease"
    Cells(4, 15).Value = "Greatest Total Volume"
    
    'determine total number of rows with data'
    NumRows = Range("J1", Range("J1").End(xlDown)).Rows.Count

    'declare and initialize counter variables'
    Dim prctIncCounter As Double
    prctIncCounter = 0

    Dim prctDecCounter As Double
    prctDecCounter = 0

    Dim totalVolCounter As Double
    totalVolCounter = 0

    'for loop will loop through all data with 3 if statements for 3 calculations'
    For i = 2 To NumRows

        'compare current cell to % increase counter; if greater, replace the current counter & proint values
        If Cells(i, 12).Value > prctIncCounter Then
            prctIncCounter = Cells(i, 12).Value
            Cells(2, 17).Value = prctIncCounter
            Cells(2, 16).Value = Cells(i, 10)
        End If

        'compare current cell to % decrease counter; if less, replace the current counter & print values
        If Cells(i, 12).Value < prctDecCounter Then
            prctDecCounter = Cells(i, 12).Value
            Cells(3, 17).Value = prctDecCounter
            Cells(3, 16).Value = Cells(i, 10)
        End If

        'compare current cell to total volume counter, if greater replace the current counter & print values'
        If Cells(i, 13).Value > totalVolCounter Then
            totalVolCounter = Cells(i, 13).Value
            Cells(4, 17).Value = totalVolCounter
            Cells(4, 16).Value = Cells(i, 10)
        End If

    Next i


End Sub

Sub Formatto()

'Sub-routine to format final ticker data

    'Format calculations with appropriate number types
    Columns(11).NumberFormat = "0.00000000" 'set yearly change to number with eight decimals'
    Columns(12).NumberFormat = "0.00%" 'set percent change to percentage with two decimals'
    Range("Q2:Q3").NumberFormat = "0.00%" 'set % inc/dec values to %
    Range("Q4").NumberFormat = "General" 'Set greatest total volume to general

    'count number of rows of ticker data'
    NumRows = Range("J1", Range("J1").End(xlDown)).Rows.Count

    'conditional formatting for yearly change column'
    For k = 2 To NumRows
        If Cells(k, 11).Value > 0 Then
            Cells(k, 11).Interior.ColorIndex = 4
        ElseIf Cells(k, 11).Value < 0 Then
            Cells(k, 11).Interior.ColorIndex = 3
        End If
    Next k
    
    'Autofil cells to content
    Columns("J:Q").AutoFit

End Sub

Sub runStockAllSheets()

'Subroutine to run macro on all worksheets'

    Dim xSh As Worksheet
    Application.ScreenUpdating = False  'do not switch tabs while calculating'
    
    For Each xSh In ActiveWorkbook.Worksheets 'run stockHard subroutine on each sheet'
        xSh.Activate
        Call stockHard
    Next xSh
    
    Application.ScreenUpdating = True
    
End Sub