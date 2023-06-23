using System.Text.Json;

public static class JSON {
    public static readonly string Null = "\"none\"";

    static readonly JsonSerializerOptions _options = new JsonSerializerOptions {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true,
    };

    public static string Stringify(object obj, JsonSerializerOptions? options = null) {
        return JsonSerializer.Serialize(obj, options ?? _options);
    }

    public static object Parse(string json, bool fast = false) {
        if (fast) return JsonSerializer.Deserialize<object>(json) ?? "\"none\"";

        try {
            return JsonSerializer.Deserialize<object>(json) ?? "\"none\"";
        }
        catch (JsonException) {
            return "\"none\"";
        }
    }
}