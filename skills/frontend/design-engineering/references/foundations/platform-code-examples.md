# Platform Code Examples

The same small design system written five ways: CSS, SwiftUI, Jetpack Compose, Flutter, and WinUI XAML. Use it as the pattern for turning any token pack, brand preset, or style reference into native code.

The examples use the `terracotta-craft` token pack. They are illustrative and were not compiled as part of this suite. Check API names against the toolkit version in the project.

Each example shows four things: colour roles with a dark variant, spacing and radius tokens, a primary button with its states, and one layout that adapts to the available width.

## 1. Web: CSS

```css
:root {
  color-scheme: light dark;
  --color-canvas: light-dark(#faf6ef, #171310);
  --color-surface: light-dark(#f2eadc, #211b17);
  --color-ink: light-dark(#201a16, #f4ede2);
  --color-action: light-dark(#a4482b, #d98463);
  --color-on-action: light-dark(#fff8f0, #1b100b);

  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --radius-control: 0.5rem;
  --size-touch: 3rem;
}

.btn {
  min-block-size: var(--size-touch);
  padding-inline: var(--space-5);
  background: var(--color-action);
  color: var(--color-on-action);
  border: 0;
  border-radius: var(--radius-control);
  font-weight: 600;
  transition: opacity 150ms ease-out;
}

.btn:active {
  opacity: 0.85;
}

.btn:disabled {
  opacity: 0.5;
}

.btn:focus-visible {
  outline: 3px solid var(--color-ink);
  outline-offset: 2px;
}

.split {
  display: grid;
  gap: var(--space-6);
}

@media (width >= 64rem) {
  .split {
    grid-template-columns: 7fr 5fr;
  }
}
```

## 2. iOS and macOS: SwiftUI

Colours live in the asset catalogue, each with a light and a dark appearance. Text uses system text styles so Dynamic Type works.

```swift
import SwiftUI

enum Space {
    static let s4: CGFloat = 16
    static let s5: CGFloat = 20
    static let s6: CGFloat = 24
}

enum Radius {
    static let control: CGFloat = 8
}

extension Color {
    static let canvas = Color("Canvas")
    static let surface = Color("Surface")
    static let ink = Color("Ink")
    static let action = Color("Action")
    static let onAction = Color("OnAction")
}

struct PrimaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .frame(maxWidth: .infinity, minHeight: 48)
            .padding(.horizontal, Space.s5)
            .background(Color.action)
            .foregroundStyle(Color.onAction)
            .clipShape(RoundedRectangle(cornerRadius: Radius.control, style: .continuous))
            .opacity(isEnabled ? (configuration.isPressed ? 0.85 : 1) : 0.5)
    }
}

struct SplitLayout<Lead: View, Aside: View>: View {
    @Environment(\.horizontalSizeClass) private var sizeClass
    @ViewBuilder var lead: Lead
    @ViewBuilder var aside: Aside

    var body: some View {
        if sizeClass == .compact {
            VStack(alignment: .leading, spacing: Space.s6) {
                lead
                aside
            }
        } else {
            HStack(alignment: .top, spacing: Space.s6) {
                lead
                aside
            }
        }
    }
}
```

Notes: the system draws the focus ring on macOS and for keyboard users on iPadOS. Give icon-only buttons an `accessibilityLabel`.

## 3. Android: Jetpack Compose

Brand colours map onto Material colour roles. Text sizes are in `sp` through the typography object.

```kotlin
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.material3.windowsizeclass.WindowWidthSizeClass
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

object Space {
    val s4 = 16.dp
    val s5 = 20.dp
    val s6 = 24.dp
}

private val LightColors = lightColorScheme(
    primary = Color(0xFFA4482B),
    onPrimary = Color(0xFFFFF8F0),
    background = Color(0xFFFAF6EF),
    surface = Color(0xFFF2EADC),
    onBackground = Color(0xFF201A16),
    onSurface = Color(0xFF201A16),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFD98463),
    onPrimary = Color(0xFF1B100B),
    background = Color(0xFF171310),
    surface = Color(0xFF211B17),
    onBackground = Color(0xFFF4EDE2),
    onSurface = Color(0xFFF4EDE2),
)

@Composable
fun AppTheme(dark: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (dark) DarkColors else LightColors,
        shapes = Shapes(small = RoundedCornerShape(8.dp), medium = RoundedCornerShape(12.dp)),
        content = content,
    )
}

@Composable
fun PrimaryButton(label: String, enabled: Boolean = true, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        enabled = enabled,
        shape = MaterialTheme.shapes.small,
        modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp),
        contentPadding = PaddingValues(horizontal = Space.s5),
    ) {
        Text(label, style = MaterialTheme.typography.labelLarge)
    }
}

@Composable
fun SplitLayout(
    widthClass: WindowWidthSizeClass,
    lead: @Composable () -> Unit,
    aside: @Composable () -> Unit,
) {
    if (widthClass == WindowWidthSizeClass.Compact) {
        Column(verticalArrangement = Arrangement.spacedBy(Space.s6)) {
            lead()
            aside()
        }
    } else {
        Row(horizontalArrangement = Arrangement.spacedBy(Space.s6)) {
            Box(Modifier.weight(7f)) { lead() }
            Box(Modifier.weight(5f)) { aside() }
        }
    }
}
```

Notes: Material components supply pressed, focused, and disabled states. Give icon buttons a `contentDescription`.

## 4. Cross-platform: Flutter

```dart
import 'package:flutter/material.dart';

abstract final class Space {
  static const double s4 = 16;
  static const double s5 = 20;
  static const double s6 = 24;
}

ThemeData buildTheme(Brightness brightness) {
  final isDark = brightness == Brightness.dark;
  final scheme = ColorScheme(
    brightness: brightness,
    primary: isDark ? const Color(0xFFD98463) : const Color(0xFFA4482B),
    onPrimary: isDark ? const Color(0xFF1B100B) : const Color(0xFFFFF8F0),
    secondary: isDark ? const Color(0xFFD98463) : const Color(0xFFA4482B),
    onSecondary: isDark ? const Color(0xFF1B100B) : const Color(0xFFFFF8F0),
    error: const Color(0xFFB3261E),
    onError: Colors.white,
    surface: isDark ? const Color(0xFF171310) : const Color(0xFFFAF6EF),
    onSurface: isDark ? const Color(0xFFF4EDE2) : const Color(0xFF201A16),
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size.fromHeight(48),
        padding: const EdgeInsets.symmetric(horizontal: Space.s5),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    ),
  );
}

class SplitLayout extends StatelessWidget {
  const SplitLayout({super.key, required this.lead, required this.aside});

  final Widget lead;
  final Widget aside;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth < 600) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [lead, const SizedBox(height: Space.s6), aside],
          );
        }
        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(flex: 7, child: lead),
            const SizedBox(width: Space.s6),
            Expanded(flex: 5, child: aside),
          ],
        );
      },
    );
  }
}
```

Notes: use `theme` and `darkTheme` on `MaterialApp` with `themeMode: ThemeMode.system`. Do not override the text scaler to a fixed value. Wrap icon-only controls in `Semantics` or use the `tooltip` parameter.

## 5. Windows: WinUI XAML

Colours go in theme dictionaries so the system light, dark, and high-contrast settings apply.

```xml
<ResourceDictionary
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">

    <ResourceDictionary.ThemeDictionaries>
        <ResourceDictionary x:Key="Light">
            <SolidColorBrush x:Key="CanvasBrush" Color="#FAF6EF" />
            <SolidColorBrush x:Key="InkBrush" Color="#201A16" />
            <SolidColorBrush x:Key="ActionBrush" Color="#A4482B" />
            <SolidColorBrush x:Key="OnActionBrush" Color="#FFF8F0" />
        </ResourceDictionary>
        <ResourceDictionary x:Key="Dark">
            <SolidColorBrush x:Key="CanvasBrush" Color="#171310" />
            <SolidColorBrush x:Key="InkBrush" Color="#F4EDE2" />
            <SolidColorBrush x:Key="ActionBrush" Color="#D98463" />
            <SolidColorBrush x:Key="OnActionBrush" Color="#1B100B" />
        </ResourceDictionary>
        <ResourceDictionary x:Key="HighContrast">
            <SolidColorBrush x:Key="CanvasBrush" Color="{ThemeResource SystemColorWindowColor}" />
            <SolidColorBrush x:Key="InkBrush" Color="{ThemeResource SystemColorWindowTextColor}" />
            <SolidColorBrush x:Key="ActionBrush" Color="{ThemeResource SystemColorHighlightColor}" />
            <SolidColorBrush x:Key="OnActionBrush" Color="{ThemeResource SystemColorHighlightTextColor}" />
        </ResourceDictionary>
    </ResourceDictionary.ThemeDictionaries>

    <x:Double x:Key="Space6">24</x:Double>
    <CornerRadius x:Key="RadiusControl">8</CornerRadius>

    <Style x:Key="PrimaryButtonStyle" TargetType="Button" BasedOn="{StaticResource AccentButtonStyle}">
        <Setter Property="Background" Value="{ThemeResource ActionBrush}" />
        <Setter Property="Foreground" Value="{ThemeResource OnActionBrush}" />
        <Setter Property="CornerRadius" Value="{StaticResource RadiusControl}" />
        <Setter Property="MinHeight" Value="40" />
        <Setter Property="Padding" Value="20,0" />
    </Style>
</ResourceDictionary>
```

```xml
<Grid x:Name="Split" ColumnSpacing="24" RowSpacing="24">
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="*" />
        <ColumnDefinition x:Name="AsideColumn" Width="0" />
    </Grid.ColumnDefinitions>
    <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <RowDefinition Height="Auto" />
    </Grid.RowDefinitions>

    <ContentPresenter x:Name="Lead" />
    <ContentPresenter x:Name="Aside" Grid.Row="1" />

    <VisualStateManager.VisualStateGroups>
        <VisualStateGroup>
            <VisualState x:Name="Wide">
                <VisualState.StateTriggers>
                    <AdaptiveTrigger MinWindowWidth="1008" />
                </VisualState.StateTriggers>
                <VisualState.Setters>
                    <Setter Target="AsideColumn.Width" Value="*" />
                    <Setter Target="Aside.(Grid.Row)" Value="0" />
                    <Setter Target="Aside.(Grid.Column)" Value="1" />
                </VisualState.Setters>
            </VisualState>
        </VisualStateGroup>
    </VisualStateManager.VisualStateGroups>
</Grid>
```

Notes: basing the style on the built-in accent button keeps the pointer-over, pressed, disabled, and focus visuals. Set `AutomationProperties.Name` on icon-only buttons. Give the window a minimum size.

## 6. What Stays the Same

| Decision        | Same on every platform                                   | Differs                                    |
| --------------- | -------------------------------------------------------- | ------------------------------------------ |
| Colour roles    | Canvas, surface, ink, action, on-action, with a dark set | Where they are declared                    |
| Spacing         | The 4-unit scale                                         | The unit name                              |
| Button          | One primary per view, states, minimum target             | Which states the toolkit supplies for free |
| Adaptive layout | Stack when narrow, split 7 to 5 when wide                | The width mechanism and its threshold      |
| Accessibility   | Names on icon controls, text follows system size         | The API                                    |
