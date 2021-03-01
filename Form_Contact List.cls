VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "Form_Contact List"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Compare Database
Option Explicit

Private Function clearBox()
    [SearchBox] = Null
End Function

Private Sub LabelWizard_Click()
On Error GoTo ErrorHandler

    ' Code by Jeff Conrad
    ' This button launches the Label Report Wizard
    ' The second argument requires the name of a saved table or query name
    ' for the wizard to point to
    Application.Run "acwzmain.mlbl_Entry", "Contacts"
    
ExitPoint:
    Exit Sub
    
ErrorHandler:
    'MsgBox "The following error has occurred:" _
    '& vbNewLine & "Error Number: " & Err.Number _
    '& vbNewLine & "Error Description: " & Err.Description _
    ', vbExclamation, "Unexpected Error"
    MsgBox "In order to launch the labels wizard you must click the Open button on the security notice." _
    & vbNewLine & "Error Number: " & Err.Number _
    & vbNewLine & "Error Description: " & Err.Description _
    , vbExclamation, "Unexpected Error"
    Resume ExitPoint
    
End Sub

