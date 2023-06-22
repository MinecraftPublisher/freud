Random Rng = new Random();

string[] Parts = {};
Action[] Functions = {};
string[] Loaded = {};

Dictionary<string, string> Memory = new Dictionary<string, string>();

string MakeId(int Length) {
    string Result = "";
    string Characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    for(int i = 0; i < Length; i++) Result += Characters[Rng.Next(0, Characters.Length - 1)];
    return Result;
}

string[] Bracket(string Text, char Start, char End) {
    List<string> Result = new List<string>();

    int j = Text.IndexOf(Start) + 1;
    while (j != 0) {
        j = Text.IndexOf(Start) + 1;

        string Output = "";
        Text = Text.Substring(j);
        while(Text.Length != 0 && !Text.StartsWith(End)) {
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
string Freud(string Code, int Num = 0) {
    // Break down the code into lines
    string[] Lines = Code.Split(Environment.NewLine);
    // Remove whitespace from each line
    for(int i = 0; i < Lines.Length; i++) 
        while(Lines[i].StartsWith(' ') || Lines[i].StartsWith('\t')) 
            Lines[i] = Lines[i].Substring(1);

    string last = "\"none\"";
    for(int i = 0; i < Lines.Length; i++) {
        //* Start variables
        string Line = Lines[i];

        string[] CallArray = Bracket(Line, '[', ']');
        for (int j = 0; j < CallArray.Length; j++) {
			string Current = CallArray[j];
			string Name = MakeId(20);
			Memory.Add(Name, Freud(Current.Substring(1, Current.Length - 1), -(Num + i)) ?? "\"none\"");
			Line = Line.Replace(Current, Name);
		}

        string[] VariableArray = Bracket(Line, '{', '}');
        for (int j = 0; j < VariableArray.Length; j++) {
			string Current = VariableArray[j];
			string Name = MakeId(20);
			Line = Line.Replace(Current, Name);
		}
    }

    return "";
}