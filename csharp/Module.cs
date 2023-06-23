using Jint;
using Payload = System.Func<ModuleInput, ModuleInput>;

public struct ModulePayload {
    public string Name;
    public Payload Payload;

    public ModulePayload(string Name, Payload Payload) {
        this.Name = Name;
        this.Payload = Payload;
    }

    public ModulePayload() {
        this.Name = JSON.Null;
        this.Payload = ((ModuleInput data) => {
            throw new KeyNotFoundException($"Unknown command \"{data.Command}\" at line {data.I + data.Num} in \"{data.Line}\"");
        });
    }
}

public class Module {
    bool NameSet;
    string Name;
    Dictionary<string, ModulePayload> Functions = new Dictionary<string, ModulePayload>();

    public Module() {
        this.Name = "";
        this.NameSet = false;
    }

    public Module(string Name) {
        this.Name = Name;
        this.NameSet = true;
    }

    public void SetName(string Name) {
        if (!NameSet) {
            NameSet = true;
            this.Name = Name;
        } else throw new ArgumentException("Module has already been initiated.");
    }

    public string GetName() {
        if (!NameSet) throw new ArgumentException("Module has not been initiated.");
        return Name;
    }

    public void AddFunction(ModulePayload Function) {
        Functions[Function.Name] = Function;
    }

    public bool HasFunction(string Name) {
        return Functions.ContainsKey(Name);
    }

    public ModulePayload GetFunction(string Name) {
        if (Functions.ContainsKey(Name)) return Functions[Name];
        else return new ModulePayload();
    }
}

public struct ModuleInput {
    public Random Rng;

    public Module BuiltIn;
    public Module Standard;
    public Module External;

    public Dictionary<string, string> Memory;

    public Action<string, Payload> Populate;
    public Func<int, string> MakeId;
    public Func<string, char, char, string[]> Bracket;
    public Func<string, int, string> Freud;

    public int Num;

    public Engine JavaScript;

    public string[] Lines;
    public int I;
    public string Line;

    public string[] Splits;
    public bool HasStore;
    public string Name;
    public string Result;
    public string Command;
    public string[] Args;

    public ModuleInput(Random Rng,
        Module BuiltIn, Module Standard, Module External,
        Dictionary<string, string> Memory,
        Action<string, Payload> Populate, Func<int, string> MakeId,
        Func<string, char, char, string[]> Bracket, Func<string, int, string> Freud,
        int Num,
        Engine JavaScript,
        string[] Lines, int i, string Line, string[] Splits,
        bool HasStore, string Name, string Result,
        string Command, string[] Args) {
            this.Rng = Rng;
            this.BuiltIn = BuiltIn;
            this.Standard = Standard;
            this.External = External;
            this.Memory = Memory;
            this.Populate = Populate;
            this.MakeId = MakeId;
            this.Bracket = Bracket;
            this.Freud = Freud;
            this.Num = Num;
            this.JavaScript = JavaScript;
            this.Lines = Lines;
            this.I = i;
            this.Line = Line;
            this.Splits = Splits;
            this.HasStore = HasStore;
            this.Name = Name;
            this.Result = Result;
            this.Command = Command;
            this.Args = Args;
    }
}