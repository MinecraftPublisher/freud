using System.Text.RegularExpressions;
using Jint;
using Payload = System.Func<ModuleInput, ModuleInput>;

Random Rng = new Random();

//^ These module containers have been sorted based on priority
Module BuiltIn = new Module();
Module Standard = new Module();
Module External = new Module();

void Populate(string Name, Payload Function) {
    BuiltIn.AddFunction(new ModulePayload(Name, Function));
}

//^ The memory only supports strings because everything is stored in JSON format
Dictionary<string, string> Memory = new Dictionary<string, string>();

string MakeId(int Length) {
    string Result = "";
    string Characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (int i = 0; i < Length; i++) Result += Characters[Rng.Next(0, Characters.Length - 1)];
    return Result;
}

string[] Bracket(string Text, char Start, char End) {
    List<string> Result = new List<string>();

    int j = Text.IndexOf(Start) + 1;
    while (j != 0) {
        j = Text.IndexOf(Start) + 1;

        string Output = "";
        Text = Text.Substring(j);
        while (Text.Length != 0 && !Text.StartsWith(End)) {
            Output += Text[0];
            Text = Text.Substring(1);
        }

        Text = Text.Substring(1);
        Result.Add(Output);
        j = Text.IndexOf(Start) + 1;
    }

    return Result.ToArray();
}

// This is the interpreter, Silly! :P
string Freud(string Code, int Num = 1) {
    Engine JavaScript = new Engine();

    // Break down the code into lines
    string[] Lines = Code.Split(Environment.NewLine);
    // Remove whitespace from each line
    for (int i = 0; i < Lines.Length; i++)
        while (Lines[i].StartsWith(' ') || Lines[i].StartsWith('\t'))
            Lines[i] = Lines[i].Substring(1);

    string Last = JSON.Null;
    for (int I = 0; I < Lines.Length; I++) {
        //* Start variables
        string Line = Lines[I];

        //& Inline code executions
        string[] CallArray = Bracket(Line, '[', ']');
        for (int j = 0; j < CallArray.Length; j++) {
            string Current = CallArray[j];
            string _Name = MakeId(20);
            Memory[_Name] = Freud(Current, -(Num + I)) ?? JSON.Null;

            //!UNSAFE
            Line = Regex.Replace(Line, @"\[" + Current + @"\]", _Name);
        }

        //& Inline memory calls
        string[] VariableArray = Bracket(Line, '{', '}');
        for (int j = 0; j < VariableArray.Length; j++) {
            string Current = VariableArray[j];

            //!UNSAFE
            Line = Line.Replace("{" + Current + "}", (string)JSON.Parse(Memory[Current]));
        }

        string[] Splits = Line.Split(' ');
        bool HasStore = Splits[0].StartsWith('.');
        string Name = HasStore ? Splits[0].Substring(1) : JSON.Null;
        if (HasStore) Splits = Splits.Skip(1).ToArray();

        string Result = JSON.Null;

        string Command = Splits[0];
        string[] Args = Splits.Skip(1).ToArray();
        //* End variables

        ModuleInput CurrentInput = new ModuleInput(Rng, BuiltIn, Standard, External, Memory, 
            Populate, MakeId, Bracket, Freud, Num, JavaScript, Lines, I, Line, Splits, HasStore, Name, Result, Command, Args);

        //? Expandable function finder
        ModulePayload Final = BuiltIn.HasFunction(Command) ? BuiltIn.GetFunction(Command) :
            Standard.HasFunction(Command) ? Standard.GetFunction(Command) :
            External.GetFunction(Command); //^ Throws an error if none are found

        ModuleInput Output = Final.Payload(CurrentInput);
        Rng = Output.Rng;
        BuiltIn = Output.BuiltIn;
        Standard = Output.Standard;
        External = Output.External;
        Memory = Output.Memory;
        Num = Output.Num;
        JavaScript = Output.JavaScript;
        Lines = Output.Lines;
        I = Output.I;
        Result = Output.Result;
    }

    return Last;
}